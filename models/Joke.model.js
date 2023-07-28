const { Schema, model } = require("mongoose");

const jokeSchema = new Schema(
  {
    author: { type: Schema.Types.ObjectId, ref: "User" },
    content: String,
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }]
  },
  {
    timestamps: true
  }
);

const Joke = model("Joke", jokeSchema);

module.exports = Joke;
