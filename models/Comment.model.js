const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    author: { type: Schema.Types.ObjectId, ref: "User" },
    joke: { type: Schema.Types.ObjectId, ref: "Joke" },
  },
  {
    timestamps: true,
  }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
