/**
 * @title
 * Application entry script
 * 
 * 
 * @lastEdit
 * Oct 24 2022, Kareem Sapi
 */

 const express = require('express');
 const compression = require('compression');
 const config = require('config');
 const cors = require('cors');
 const passport = require('passport');
 const path = require('path');
 const mongoose = require('mongoose');
 const cookieParser = require('cookie-parser');
 
 require('./passport');

 // Set up default mongoose connection
const mongoDB = config.get('db.mongoDb');
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });

// Get the default connection
const db = mongoose.connection;

// Bind connection to error event (to get notification of connection errors)
db.on("error", console.error.bind(console, "MongoDB connection error:"));
 
 const authRouter = require(`./api/routes/auth`);
 const userRouter = require('./api/routes/user');
 const bookRouter = require('./api/routes/book');
 
 const app = express();
 
 app.set("views", path.join(__dirname, "views"));
 app.set("view engine", "pug");
 
 app.use(cors())
 app.use(compression())
 app.use(express.json())
 app.use(cookieParser());

app.use(express.static(path.join(__dirname, "public")));
 
 const app_name = "Library Management System";
 const { port, root } = config.get('api');
 const PORT = 3000 || port
 const auth = passport.authenticate('jwt', {session: false})
 
 app.use(`${root}/auth`, authRouter);
 app.use(`${root}/user`, auth, userRouter);
 app.use(`${root}/catalog`, auth, bookRouter);
 
 app.get('/', (req,res) => {
     res.send("Welcome to " + app_name)
 })
 
 app.listen(PORT, console.log(`Server started listening on port: ${PORT}`))