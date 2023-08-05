const { Schema, model } = require("mongoose");

const jokeSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
  },
  {
    timestamps: true,
  }
);

const Joke = model("Joke", jokeSchema);

module.exports = Joke;
