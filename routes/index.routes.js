const express = require('express');
const router = express.Router();
const hbs = require('hbs');


/* GET home page */
router.get("/", (req, res, next) => {
  res.render("index");
});

module.exports = router;
