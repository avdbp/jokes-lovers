const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");


const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");


const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


router.get("/create-joke", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
    User.find()
      .then((dbUsers) => {
        res.render("jokes/create-joke", { dbUsers, user: currentUser });
      })
      
      .catch((err) => next(err));
  });
  
  router.post("/create", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
    let { content } = req.body;

    Joke.create({ content, author: currentUser })
      .then((newJoke) => {
        return User.findByIdAndUpdate(
          currentUser._id,
          { $push: { jokes: newJoke._id } },
          { new: true }
        );
      })
      .then((response)  => {
        console.log(response);
        res.redirect("/jokes/jokes-list");
      })
      .catch((err) => next(err));
  });


  router.get("/jokes-list", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;

    Joke.find()
      .populate("author")
      .then((jokes) => {
        res.render("jokes/jokes-list", { jokes, user: currentUser });
      })
      .catch((err) => next(err));
  });


  
  router.get("/:id", isLoggedIn, (req, res, next) => {
  const jokeId = req.params.id;

  Joke.findById(jokeId)
    .populate("author comments")
    .populate({
      path: "comments",
      populate: {
        path: "author",
        model: "User",
      },
    })
    .then((joke) => {
      res.render("jokes/joke-details", {
        content: joke.content,
        author: joke.author,
        comments: joke.comments,
      });
    })
    .catch((err) => next(err));
});




  // router.post("/create/comment", isLoggedIn, (req, res, next) => {
  //   const currentUser = req.session.currentUser;
  //   let { content } = req.body;

  //   Comment.create({ content})
  //     .then((newComment) => {
  //       return User.findByIdAndUpdate(
  //         currentUser._id,
  //         { $push: { comment: newComment._id }},
  //         { new: true }
  //       );
        
  //     })
      
  //     .then((response)  => {
  //       console.log(response);
  //       res.redirect("/jokes/joke-details",);
  //     })
  //     .catch((err) => next(err));
  // });


  router.post("/create/comment", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
    const { content } = req.body;
    const jokeId = req.body.d; // Assuming you have a hidden input field with the jokeId in your form
  
    Comment.create({ content, author: currentUser, joke: jokeId })
      .then((newComment) => {
        return Joke.findByIdAndUpdate(
          jokeId,
          { $push: { comments: newComment._id } },
          { new: true }
        );
      })
      .then((updatedJoke) => {
        console.log("Updated Joke:", updatedJoke);
        res.redirect("/jokes/joke-details");
      })
      .catch((err) => next(err));
  });
  



module.exports = router;
