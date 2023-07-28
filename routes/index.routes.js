const express = require('express');
const router = express.Router();
const hbs = require('hbs');


/* GET home page */
router.get("/", (req, res, next) => {
  const currentUser = req.session.currentUser || null;
  res.render("index", { user: currentUser });
});

module.exports = router;
