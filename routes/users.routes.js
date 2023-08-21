const express = require("express");
const multer = require('multer');
const router = express.Router();
const path = require("path");



const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

const isLoggedIn = require("../middleware/isLoggedIn");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); 
  },
  filename: function (req, file, cb) {
    const userId = req.session.currentUser._id;

    const ext = path.extname(file.originalname);

    const uniqueFilename = `${userId}${ext}`;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });


//GET /users/profile
router.get("/profile", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;

  User.findById(currentUser._id)
    .populate({
      path: "jokes",
      options: { sort: { createdAt: -1 } }, 
      populate: {
        path: "comments",
        options: { sort: { createdAt: -1 } }, 
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

//POST /users/profile/:id/delete
router.post("/profile/:id/delete", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const jokeId = req.params.id;

  Joke.findByIdAndDelete(jokeId)
    .then(() => {
      return Comment.deleteMany({ joke: jokeId });
    })
    .then(() => {
      res.redirect("/users/profile");
    })
    .catch(error => {
      next(error);
    });
});

//GET /users/profile/:id/edit-joke
  router.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
    const jokeId = req.params.id;
    const currentUser = req.session.currentUser;
    
    Joke.findOne({ _id: jokeId, author: req.session.currentUser._id })
      .then(joke => {
        if (!joke) {
          return res.redirect("/users/profile");
        }
        res.render("users/edit-joke", { joke, user: currentUser });

      })
      .catch(err => next(err));
  });

//POST /users/profile/:id/edit-joke
  router.post("/profile/:id/edit", isLoggedIn, (req, res, next) => {
    const jokeId = req.params.id;
    const { title, content } = req.body;
    
    Joke.findOneAndUpdate({ _id: jokeId, author: req.session.currentUser._id },
      { $set: { title, content } },
      { new: true }
    )
    .then(updatedJoke => {
      if (!updatedJoke) {
        return res.redirect("/users/profile" );
      }
      
      res.redirect("/users/profile");
    })
    .catch(err => next(err));
  });
  
//GET /users/edit-profile
  router.get("/edit-profile", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
    res.render("users/edit-profile", { user: currentUser });
  });

//POST /users/edit-profile
  router.post("/edit-profile", isLoggedIn, upload.single("avatar"), (req, res, next) => {
    const userId = req.session.currentUser._id;
    const { name, username, email } = req.body;
  
    let avatarPath = req.session.currentUser.avatarPath;
    if (req.file) {
      const ext = path.extname(req.file.originalname);
      avatarPath = `/images/${userId}${ext}`; 
    }
  
    User.findByIdAndUpdate(
      userId,
      { name, username, email, avatarPath }, 
      { new: true }
    )
      .then(updatedUser => {
        req.session.currentUser = updatedUser;
        res.redirect("/users/profile");
      })
      .catch((err) => next(err));
  });
  


module.exports = router;
