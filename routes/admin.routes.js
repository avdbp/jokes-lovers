const express = require("express");
const router = express.Router();


// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

// GET /admin/admin-dashboard
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
        res.render("admin/admin-dashboard", { users, user: req.session.currentUser });
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

// POST /users/:id/delete
router.post("/jokes/:id/delete", isLoggedIn, (req, res, next) => {
  
  const jokeId = req.params.id;

  Joke.findByIdAndDelete(jokeId)
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));

});

// POST /admin/comments/:id/delete
router.post("/comments/:id/delete", isLoggedIn, (req, res, next) => {
  const commentId = req.params.id;

  Comment.findByIdAndDelete(commentId)
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));
});





module.exports = router;
