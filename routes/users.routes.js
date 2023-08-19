const express = require("express");
const multer = require('multer');
const router = express.Router();
const path = require("path");



// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); // Ruta donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    // Obtener el ID del usuario actual
    const userId = req.session.currentUser._id;

    // Obtener la extensión del archivo
    const ext = path.extname(file.originalname);

    // Construir el nombre de archivo único con el ID del usuario y la extensión
    const uniqueFilename = `${userId}${ext}`;

    cb(null, uniqueFilename);
  },
});

const upload = multer({ storage: storage });



router.get("/profile", isLoggedIn, (req, res, next) => {
  const currentUser = req.session.currentUser;

  User.findById(currentUser._id)
    .populate({
      path: "jokes",
      options: { sort: { createdAt: -1 } }, // Ordenar chistes por fecha de creación en orden descendente
      populate: {
        path: "comments",
        options: { sort: { createdAt: -1 } }, // Ordenar comentarios por fecha de creación en orden descendente
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


router.post("/profile/:id/delete", isLoggedIn, (req, res, next) => {
  const userId = req.session.currentUser._id;
  const jokeId = req.params.id;

  // Borrar el chiste y sus comentarios asociados
  Joke.findByIdAndDelete(jokeId)
    .then(() => {
      // Borrar los comentarios del chiste
      return Comment.deleteMany({ joke: jokeId });
    })
    .then(() => {
      // Redirigir a la página de perfil del usuario
      res.redirect("/users/profile");
    })
    .catch(error => {
      next(error);
    });
});

  
  router.get("/profile/:id/edit", isLoggedIn, (req, res, next) => {
    const jokeId = req.params.id;
    
    Joke.findOne({ _id: jokeId, author: req.session.currentUser._id })
      .then(joke => {
        if (!joke) {
          // Manejo si el chiste no se encuentra o no pertenece al usuario
          return res.redirect("/users/profile");
        }
        
        res.render("users/edit-joke", { joke, currentUser: req.session.currentUser });
      })
      .catch(err => next(err));
  });

  router.post("/profile/:id/edit", isLoggedIn, (req, res, next) => {
    const jokeId = req.params.id;
    const { title, content } = req.body;
    
    Joke.findOneAndUpdate({ _id: jokeId, author: req.session.currentUser._id },
      { $set: { title, content } },
      { new: true }
    )
    .then(updatedJoke => {
      if (!updatedJoke) {
        // Manejo si el chiste no se encuentra o no pertenece al usuario
        return res.redirect("/users/profile");
      }
      
      res.redirect("/users/profile");
    })
    .catch(err => next(err));
  });
  

  router.get("/edit-profile", isLoggedIn, (req, res, next) => {
    const currentUser = req.session.currentUser;
    res.render("users/edit-profile", { user: currentUser });
  });
  
  router.post("/edit-profile", isLoggedIn, upload.single("avatar"), (req, res, next) => {
    const userId = req.session.currentUser._id;
    const { name, username, email } = req.body;
  
    let avatarPath = req.session.currentUser.avatarPath;
    if (req.file) {
      // Construir la ruta relativa deseada
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
