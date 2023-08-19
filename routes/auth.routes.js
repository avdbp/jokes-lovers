const express = require("express");
const router = express.Router();
const session = require('express-session')



// ℹ️ Handles password encryption
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

// How many rounds should bcrypt run the salt (default - 10 rounds)
const saltRounds = 10;

// Require the User model in order to interact with the database
const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

// Require necessary (isLoggedOut and isLiggedIn) middleware in order to control access to specific routes
const isLoggedOut = require("../middleware/isLoggedOut");
const isLoggedIn = require("../middleware/isLoggedIn");

const isAdmin = false;


// GET /auth/signup
router.get("/signup", isLoggedOut, (req, res, next) => {
  res.render("auth/signup");
});

// POST /auth/signup

router.post("/signup", isLoggedOut, (req, res, next) => {
  const { name, username, email, password, passwordRepeat, pin } = req.body;
  
  if (name === "" || username === "" || password === "" || passwordRepeat === "" || email === "") {
    res.render("auth/signup", {
      errorMessage: "Debe rellenar todos los campos.",
    });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: "Provide a valid email address." });
    return;
  }

  const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!passwordRegex.test(password)) {
    res.render("auth/signup", {
      errorMessage: "El Password debe tener al menos 6 caracteres y contener al menos un número, una minúscula y una letra mayúscula.",
    });
    return;
  }

  if (password !== passwordRepeat) {
    res.render("auth/signup", {
      errorMessage: "Los Password no coinciden.",
    });
    return;
  }

  User.findOne({ username })
    .then((user) => {
      if (user) {
        res.render("auth/signup", {
          errorMessage: "Este usuario ya existe.",
        });
        return;
      }

      let isAdmin = false; 
      if (pin === "3003") {
        isAdmin = true;
      }

      bcrypt
        .genSalt(saltRounds)
        .then((salt) => bcrypt.hash(password, salt))
        .then((hashedPassword) => {
          // Crear un usuario y guardar en la base de datos
          return User.create({ name, username, email, password: hashedPassword, isAdmin });
        })
        .then((user) => {
          user.avatarPath = "/images/avatar.png";
          return user.save();
        })
        .then(() => {
          res.redirect("/auth/login");
        })
        .catch((error) => {
          console.error(error);
          res.render("auth/signup", { errorMessage: "Error en el registro." });
        });
    })
    .catch((error) => {
      console.error(error);
      res.render("auth/signup", { errorMessage: "Error en el registro." });
    });
});


// GET /auth/login
router.get("/login", isLoggedOut, (req, res, next) => {
  res.render("auth/login");
});

// POST /auth/login
router.post("/login", isLoggedOut, (req, res, next) => {
  const { username, password } = req.body;

  // Check that username, email, and password are provided
  if (username === "" || password === "") {
    res.status(400).render("auth/login", {
      errorMessage:
      "Todos los campos deben estar llenos",
    });

    return;
  }

  // Search the database for a user with the email submitted in the form
  User.findOne({ username })
    .then((user) => {
      // If the user isn't found, send an error message that user provided wrong credentials
      if (!user) {
        res
          .status(400)
          .render("auth/login", { errorMessage: " Tu Username o Password no conciden, intentalo de nuevo." });
        return;
      }

      // If user is found based on the username, check if the in putted password matches the one saved in the database
      bcrypt
        .compare(password, user.password)
        .then((isSamePassword) => {
          if (!isSamePassword) {
            res
              .status(400)
              .render("auth/login", { errorMessage: "Tu Username o Password no conciden, intentalo de nuevo." });
            return;
          }

          // Add the user object to the session object
          req.session.currentUser = user.toObject();
          // Remove the password field
          delete req.session.currentUser.password;

          res.redirect("/");
        })
        .catch((err) => next(err)); // In this case, we send error handling to the error handling middleware.
    })
    .catch((err) => next(err));
});

// GET /auth/logout
router.get("/logout", isLoggedIn, (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500).render("/", { errorMessage: err.message });
      return;
    }

    return res.redirect("/auth/login");
  });
});

module.exports = router;
