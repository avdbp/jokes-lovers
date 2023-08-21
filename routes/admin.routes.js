const express = require("express");
const router = express.Router();
const moment = require('moment');
require('moment/locale/es'); 
moment.locale('es');


const User = require("../models/User.model");
const Joke = require("../models/Joke.model");
const Comment = require("../models/Comment.model");

const isLoggedIn = require("../middleware/isLoggedIn");

// GET /admin/admin-dashboard
router.get("/admin-dashboard", isLoggedIn, async (req, res, next) => {
  try {
    if (req.session.currentUser) {
      const users = await User.find()
        .populate({
          path: "jokes",
          options: { sort: { createdAt: -1 } },
          populate: {
            path: "comments",
            options: { sort: { createdAt: -1 } },
            populate: {
              path: "author",
              model: "User",
            },
          },
        });

      users.forEach((user) => {
        user.jokes.forEach((joke) => {
          joke.formattedCreatedAt = moment(joke.createdAt).format('D [de] MMMM [de] YYYY [a las] HH:mm [horas]');
          joke.comments.forEach((comment) => {
            comment.formattedCreatedAt = moment(comment.createdAt).format('D [de] MMMM [de] YYYY [a las] HH:mm [horas]');
          });
        });
      });

      res.render("admin/admin-dashboard", { users, user: req.session.currentUser });
    } else {
      res.redirect("/");
    }
  } catch (error) {
    next(error);
  }
});


// POST /users/:id/delete
router.post("/users/:id/delete", isLoggedIn, (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        res.redirect("/admin/admin-dashboard");
        return;
      }

      return Joke.find({ author: userId }).then((userJokes) => {
        const jokeDeletions = userJokes.map((joke) => {
          return Comment.deleteMany({ _id: { $in: joke.comments } }).then(() => {
            return Joke.findByIdAndDelete(joke._id);
          });
        });

        return Promise.all(jokeDeletions); 
      });
    })
    .then(() => {
      return Comment.find({ author: userId }).then((userComments) => {
        const commentDeletions = userComments.map((comment) => {
          return Comment.findByIdAndDelete(comment._id);
        });

        return Promise.all(commentDeletions); 
      });
    })
    .then(() => {
      return User.findByIdAndDelete(userId);
    })
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));
});




// POST /jokes/:id/delete
router.post("/jokes/:id/delete", isLoggedIn, (req, res, next) => {
  
  const jokeId = req.params.id;

  Joke.findByIdAndDelete(jokeId)
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));

});

// POST /comments/:id/delete
router.post("/comments/:id/delete", isLoggedIn, (req, res, next) => {
  const commentId = req.params.id;

  Comment.findByIdAndDelete(commentId)
    .then(() => {
      res.redirect("/admin/admin-dashboard");
    })
    .catch((err) => next(err));
});



// GET /users/:id/edit
router.get("/users/:id/edit", (req, res, next) => {
  const userId = req.params.id;

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.render("admin/edit-user", { user });
    })
    .catch(error => {
      next(error);
    });
});

// POST /users/:id/edit
router.post("/users/:id/edit", (req, res, next) => {
  const userId = req.params.id;
  const { name, username, email, isAdmin } = req.body;

  User.findByIdAndUpdate(userId, {
    name,
    username,
    email,
    isAdmin
  })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).send("Usuario no encontrado");
      }
      res.redirect("/admin/admin-dashboard");
    })
    .catch(error => {
      next(error);
    });
});



module.exports = router;