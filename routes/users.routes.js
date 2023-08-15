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
    console.log(currentUser);

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

  router.post("/profile/:id/delete", isLoggedIn, (req, res, next) => {
    const userId = req.session.currentUser._id;
    const jokeId = req.params.id;
  
    Joke.findOneAndDelete({ _id: jokeId, author: userId })
      .then(deletedJoke => {
        if (deletedJoke) {
          res.redirect("/users/profile");
        } else {
          res.redirect("/users/profile"); // Puedes manejar esto como prefieras
        }
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
      avatarPath = `/images/${userId}${ext}`; // Cambia esto según tu estructura de carpetas y extensiones
    }
  
    User.findByIdAndUpdate(
      userId,
      { name, username, email, avatarPath }, 
      { new: true }
    )
      .then(updatedUser => {
        // Actualizar la sesión del usuario actual con los nuevos datos
        req.session.currentUser = updatedUser;
        res.redirect("/users/profile");
      })
      .catch((err) => next(err));
  });
  


module.exports = router;
