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
    const currentUser = req.session.currentUser;
    res.render("admin/admin-dashboard", { user: currentUser });
  });
  



module.exports = router;
