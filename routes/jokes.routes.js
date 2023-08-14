const express = require('express');
const router = express.Router();
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");
const isLoggedIn = require("../middleware/isLoggedIn");
const moment = require("moment");

// GET /jokes/create-joke
router.get("/create-joke", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  res.render("jokes/create-joke", { user: currentUser });
});

// POST /jokes/create
router.post("/create", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  const { content } = req.body;

  Joke.create({ content, author: currentUser._id })
    .then((newJoke) => {
      return User.findByIdAndUpdate(
        currentUser._id,
        { $push: { jokes: newJoke._id } },
        { new: true }
      );
    })
    .then((updatedUser) => {
      console.log("User updated:", updatedUser);
      res.redirect("/jokes/jokes-list");
    })
    .catch((err) => next(err));
});


// GET /jokes/jokes-list
router.get("/jokes-list", (req, res, next) => {
  const currentUser = req.session.currentUser;

  Joke.find()
    .populate("author")
    .populate({
      path: "comments",
      populate: { path: "author" },
    })
    .sort({ createdAt: -1 }) // Ordenar por fecha de publicación descendente
    .then((jokes) => {
      jokes = jokes.map((joke) => ({
        ...joke.toObject(),
        formattedCreatedAt: moment(joke.createdAt).format("LLL"),
        comments: joke.comments.map((comment) => ({
          ...comment.toObject(),
          formattedCreatedAt: moment(comment.createdAt).format("LLL"),
        })),
      }));

      res.render("jokes/jokes-list", { jokes, user: currentUser });
    })
    .catch((err) => next(err));
});



// GET /jokes/:id
router.get("/:id", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  const jokeId = req.params.id;

  Joke.findById(jokeId)
    .populate("author")
    .populate({
      path: "comments",
      populate: { path: "author" },
    })
    .then((joke) => {
      const formattedCreatedAt = moment(joke.createdAt).format("LLL");
      const formattedComments = joke.comments.map((comment) => ({
        ...comment.toObject(),
        formattedCreatedAt: moment(comment.createdAt).format("LLL"),
      }));

      res.render("jokes/joke-details", {
        joke,
        formattedCreatedAt,
        formattedComments,
        user: currentUser,
      });
    })
    .catch((err) => next(err));
});




// POST /jokes/:id/comment
router.post("/:id/comment", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  const { content } = req.body;
  const jokeId = req.params.id;

  Comment.create({ content, author: currentUser._id, joke: jokeId })
    .then((newComment) => {
      return Joke.findByIdAndUpdate(jokeId, { $push: { comments: newComment._id } });
    })
    .then(() => {
      res.redirect("/jokes/jokes-list");
    })
    .catch((err) => next(err));
});




module.exports = router;