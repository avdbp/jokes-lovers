const mongoose = require("mongoose");

const jokeSchema = new mongoose.Schema({
  content: String,
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now, // Establece la fecha y hora actual por defecto
  },
});

const Joke = mongoose.model("Joke", jokeSchema);

module.exports = Joke;
