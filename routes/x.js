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
      const formattedJokes = user.jokes.map((joke) => ({
        ...joke.toObject(),
        formattedCreatedAt: moment(joke.createdAt).format("LLL"),
        formattedComments: joke.comments.map((comment) => ({
          ...comment.toObject(),
          formattedCreatedAt: moment(comment.createdAt).format("LLL"),
        })),
      }));

      res.render("users/profile", { user, formattedJokes, currentUser });
    })
    .catch((error) => {
      res.render("error", { error });
    });
});
