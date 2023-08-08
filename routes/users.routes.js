const express = require("express");
const multer = require('multer');
const router = express.Router();


// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");



router.get("/profile", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
  
    User.findById(currentUser._id)
      .populate("jokes")
      .populate({
        path: "jokes",
        populate: {
          path: "comments",
          populate: { path: "author" },
        },
      })
      .then(user => {
        res.render("users/profile", { user, currentUser });
      })
      .catch(error => {
        res.render("error", { error });
      });
  });


  router.get("/profile/edit", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
  
    User.findById(currentUser._id)
      .then(user => {
        res.render("users/edit-profile", { user });
      })
      .catch(error => {
        res.render("error", { error });
      });
  });
  
  router.post("/profile/edit", isLoggedIn, (req, res, next) => {
    const { name, username, email } = req.body;
    const userId = req.session.currentUser._id;
  
    User.findByIdAndUpdate(userId, { name, username, email })
      .then(updatedUser => {
        res.redirect("/users/profile");
      })
      .catch(error => {
        res.render("error", { error });
      });
  });
  



module.exports = router;
