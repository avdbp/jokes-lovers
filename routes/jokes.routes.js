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
        res.render("jokes/jokes-list", { jokes });
      })
      .catch((err) => next(err));
  });


  
  
  
  router.get("/:id", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;

    const jokeid = req.params.id;

    Joke.findById(jokeid)
      .populate("author comments")
      .populate({
        path: "comments",
        populate: {
          path: "author",
          model: "User",
        },
      })
      .then((response) => {
        console.log(response);
        res.render("jokes/joke-details", response);
      })
      .catch((err) => next(err));
  });


  



module.exports = router;
