const express = require("express");
const router = express.Router();
const moment = require('moment');



// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /admin/admin-dashboard
function formatDate(date) {
  return moment(date).format("LLL");
}

router.get("/admin-dashboard", isLoggedIn, (req, res, next) => {
  if (req.session.currentUser) {
    User.find()
      .populate({
        path: "jokes",
        populate: {
          path: "comments",
          populate: {
            path: "author",
            model: "User",
          },
        },
      })
      .then((users) => {
        const formattedUsers = users.map((user) => ({
          ...user.toObject(),
          jokes: user.jokes.map((joke) => ({
            ...joke.toObject(),
            formattedCreatedAt: formatDate(joke.createdAt),
            comments: joke.comments.map((comment) => ({
              ...comment.toObject(),
              formattedCreatedAt: formatDate(comment.createdAt),
            })),
          })),
        }));
        res.render("admin/admin-dashboard", { users: formattedUsers, user: req.session.currentUser });
      })
      .catch((err) => next(err));
  } else {
    res.redirect("/");
  }
});



  

// GET /users/:id/edit
router.get("/users/:id/edit", isLoggedIn, (req, res, next) => {

    const userId = req.params.id;

    User.findById(userId)
      .then((user) => {
        res.render("admin/edit-user", { user });
      })
      .catch((err) => next(err));
  
});

// POST /users/:id/edit
router.post("/users/:id/edit", isLoggedIn, (req, res, next) => {
  
    const userId = req.params.id;
    const { name, username, email } = req.body;
    const isAdmin = req.body.isAdmin === "true"; 

    User.findByIdAndUpdate(userId, { name, username, email, isAdmin })
      .then(() => {
        res.redirect("/admin/admin-dashboard");
      })
      .catch((err) => next(err));
  
});


// POST /users/:id/delete
router.post("/users/:id/delete", isLoggedIn, (req, res, next) => {
  
  const userId = req.params.id;

  User.findByIdAndDelete(userId)
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));

});

router.post("/jokes/:id/delete", isLoggedIn, (req, res, next) => {
  const jokeId = req.params.id;

  Joke.findByIdAndDelete(jokeId)
    .then(() => {
      // Utiliza req.headers.referer para redirigir a la página anterior
      res.redirect(req.headers.referer);
    })
    .catch((err) => next(err));
});

router.post("/comments/:id/delete", isLoggedIn, (req, res, next) => {
  const commentId = req.params.id;

  Comment.findByIdAndDelete(commentId)
    .then(() => {
      // Utiliza req.headers.referer para redirigir a la página anterior
      res.redirect(req.headers.referer);
    })
    .catch((err) => next(err));
});


router.get("/:userId/details", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;
  const userId = req.params.userId;

  User.findById(userId)
    .populate("jokes")
    .populate({
      path: "jokes",
      populate: {
        path: "comments",
        populate: { path: "author" },
      },
    })
    .then((user) => {
      const formattedJokes = user.jokes.map((joke) => ({
        ...joke.toObject(),
        formattedCreatedAt: moment(joke.createdAt).format("LLL"),
        comments: joke.comments.map((comment) => ({
          ...comment.toObject(),
          formattedCreatedAt: moment(comment.createdAt).format("LLL"),
        })),
      }));

      res.render("admin/user-details", { user, formattedJokes, currentUser });
    })
    .catch((err) => next(err));
});


module.exports = router;
