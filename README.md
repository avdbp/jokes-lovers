# Jokes Lover

Developed as a final project for the second module in my web development bootcamp at Ironhack Barcelona.

## About
Welcome to Jokes Lover, the ultimate platform for jokes and laughter! I'm Alejandro, a web developer, and I developed this project to spread some laughter in life. Jokes Lover is a fun-filled web application that allows users to share and enjoy jokes from all over the world. Whether you want to brighten your day or make someone else smile, Jokes Lover is the place to be!

![Project Image](https://ichef.bbci.co.uk/news/800/cpsprodpb/16D11/production/_108175439_gettyimages-683702656.jpg "Project Image")

## Deployment
You can experience the laughter and joy by visiting the fully deployed app [here](https://jokes-lover-app.com).

## Work Structure
During the development of Jokes Lover, I worked alone, and I'm proud to present a product that's sure to bring smiles to everyone.

## Installation Guide
To run Jokes Lover locally on your machine, follow these steps:

- Fork this repo
- Clone this repo 

```shell
$ cd jokes-lover
$ npm install
$ npm start
```

## Models
#### User.model.js
```js
const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    username: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },

    jokes: [{ type: Schema.Types.ObjectId, ref: "Joke" }],

    isAdmin: {
      type: Boolean,
      default:false,
    },

    avatarPath: { 
      type: String, 
      default: '(/images/avatar.png' 
    }, 
  


  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

```
#### Post.model.js
```js
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

```
#### Comment.model.js
```js
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

```

## User Roles

| Role  | Capabilities                                        | Property   |
| ----- | -------------------------------------------------- | ---------- |
| User  | Can login/logout. Can read all the jokes. Can create a new joke. | isAdmin: false |
| Admin | Can login/logout. Can read, edit, or delete all jokes. Can create a new joke. | isAdmin: true |

## API Routes

### Admin Routes

| Method | Endpoint                    | Middleware           | Description                       |
| ------ | --------------------------- | -------------------- | --------------------------------- |
| GET    | /admin/admin-dashboard      | isLoggedIn           | Render admin dashboard page.       |
| POST   | /users/:id/delete           | isLoggedIn           | Delete a user and associated content. |
| POST   | /jokes/:id/delete           | isLoggedIn           | Delete a joke and its comments.    |
| POST   | /comments/:id/delete        | isLoggedIn           | Delete a comment.                  |
| GET    | /users/:id/edit             | None                 | Render edit user page.             |
| POST   | /users/:id/edit             | None                 | Update user information.           |

### Authentication Routes

| Method | Endpoint         | Middleware           | Description                       |
| ------ | ---------------- | -------------------- | --------------------------------- |
| GET    | /auth/signup     | isLoggedOut          | Render sign-up page.               |
| POST   | /auth/signup     | isLoggedOut          | Create a new user account.         |
| GET    | /auth/login      | isLoggedOut          | Render login page.                 |
| POST   | /auth/login      | isLoggedOut          | Authenticate user login.           |
| GET    | /auth/logout     | isLoggedIn           | Log out the user.                  |

### Index Routes

| Method | Endpoint  | Middleware | Description             |
| ------ | --------- | ---------- | ----------------------- |
| GET    | /         | None       | Render home page.       |

### Jokes Routes

| Method | Endpoint                 | Middleware           | Description                       |
| ------ | ------------------------ | -------------------- | --------------------------------- |
| GET    | /jokes/create-joke       | isLoggedIn           | Render create joke page.          |
| POST   | /jokes/create            | isLoggedIn           | Create a new joke.                |
| GET    | /jokes/jokes-list        | None                 | Render list of jokes.             |
| GET    | /jokes/:id               | isLoggedIn           | Render joke



---

Any doubts? Contact me!

[Alejandro's LinkedIn](https://www.linkedin.com/in/alejandrovdb/) | [Email Alejandro](mailto:alejandro.vdb@gmail.com.com)
