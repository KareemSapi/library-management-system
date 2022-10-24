/**
 * @title
 * Application entry script: Msomiflix backend
 * 
 * 
 * @lastEdit
 * Oct 01 2022, Kareem Sapi
 */

 const express = require('express');
 const compression = require('compression');
 const config = require('config');
 const cors = require('cors');
 const passport = require('passport');
 
 require('./passport');
 
//  const authRouter = require(`./api/routes/auth`);
//  const userRouter = require('./api/routes/user');
//  const roleRouter = require('./api/routes/role');
 
 const app = express();
 
 function logErrors(err, req, res, next) {
     logger.error(err);
     next(err);
 }
 
 function clientErrorHandler(err, req, res, next) {
     if (req.xhr) {
         res.status(500).send({ error: 'Something went wrong.' });
     } else {
         next(err);
     }
 }
 
 app.use(cors())
 app.use(compression())
 app.use(express.json())
 
 const app_name = "Library Management System";
 const { port, root } = config.get('api');
 const PORT = 3000 || port
 const auth = passport.authenticate('jwt', {session: false})
 
//  app.use(`${root}/auth`, authRouter);
//  app.use(`${root}/user`, userRouter);
//  app.use(`${root}/role`, auth, roleRouter);
 
 app.use(logErrors);
 app.use(clientErrorHandler);
 
 app.get('/', (req,res) => {
     res.send("Welcome to " + app_name)
 })
 
 app.listen(PORT, console.log(`Server started listening on port: ${PORT}`))