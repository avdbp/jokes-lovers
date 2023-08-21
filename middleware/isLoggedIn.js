module.exports = (req, res, next) => {
  if (!req.session.currentUser) {
    return res.redirect("/auth/login");
  }

  res.locals.currentUser = req.session.currentUser;

  next();
};