const express = require('express');
const router = express.Router();

const mongoose = require("mongoose");


const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

router.get("/create-joke", (req, res, next) => {
    User.find()
      .then((dbUsers) => {
        res.render("jokes/create-joke", { dbUsers });
      })
      .catch((err) => next(err));
  });
  
  router.post("/create", (req, res, next) => {
    let { author, content, comments } = req.body;
  
    Joke.create({ author, content, comments })
      .then((newJoke) => {
        return User.findByIdAndUpdate(
          author,
          { $push: { jokes: newJoke._id } },
          { new: true }
        );
      })
      .then((response) => {
        res.send(response);
      })
      .catch((err) => next(err));
  });
  




  router.get("/jokes-list", (req, res, next) => {
    Joke.find()
      .populate("author")
      .then((jokes) => {
        res.render("jokes/jokes-list", { jokes });
      })
      .catch((err) => next(err));
  });
  
  router.get("/:idJoke", (req, res, next) => {
    Joke.findById(req.params.idJoke)
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
