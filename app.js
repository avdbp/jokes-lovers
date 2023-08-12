// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// ℹ️ Connects to the database
require("./db");

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
const express = require("express");
const axios = require('axios');
const session = require('express-session')



// Handles the handlebars
// https://www.npmjs.com/package/hbs
const hbs = require("hbs");

const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

const capitalize = require("./utils/capitalize");
const projectName = "new-app";

app.locals.appTitle = `${capitalize(projectName)} created with IronLauncher`;

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);


const jokesApiRoutes = require('./routes/jokesApi.routes');
app.use('/jokes', jokesApiRoutes);

const jokesRoutes = require('./routes/jokes.routes');
app.use('/jokes', jokesRoutes);

const adminRoutes = require('./routes/admin.routes');
app.use('/admin', adminRoutes);

const usersRoutes = require('./routes/users.routes');
app.use('/users', usersRoutes);


// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);



module.exports = app;
