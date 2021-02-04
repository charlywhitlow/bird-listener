const { PORT, MONGO_CONNECTION_URL } = require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const path = require('path');
const passport = require('passport');
const cookieParser = require('cookie-parser');

// setup mongo connection
const uri = MONGO_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true, useUnifiedTopology: true });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  console.log('Connected to mongo');
});

// create instance of an express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/public')); // serve static html/css/js in /public dir
app.use(cookieParser()); // cookies will be included in request object

// require passport auth
require('./auth/auth');
 
// public routes
app.use('/', [
  require(path.join(__dirname + '/api/public')),
  require(path.join(__dirname + '/api/users')),
  require(path.join(__dirname + '/api/admin')) // TODO: add admin-user auth
]);

// secure routes
app.use('/', passport.authenticate('jwt', { session : false, failureRedirect: '/login' }),
  [
    require(path.join(__dirname + '/api/main')),
    require(path.join(__dirname + '/api/birds')),
    require(path.join(__dirname + '/api/xeno'))
  ]
);
  
// catch all other routes
app.use((req, res, next) => {
  res.status(404);
  res.json({ message: '404 - Not Found' });
});
  
// handle errors
app.use((err, req, res, next) => {
  if (err.message){
    res.status(err.status || 500);
    res.json({ error : err.message || err });
  }else{
    // unexpected errors
    res.status(err.status || 500);
    res.json({ error : err });
  }
});

// start server listening on port
app.listen(PORT || 8000, () => {
  console.log(`Server started on port ${PORT || 8000}`);
})
// print details of process running on PORT if already in use
.on('error', (error) => {
  if (error.code == "EADDRINUSE"){
    let cmd = "lsof -p $(lsof -ti :8000) | grep -E 'COMMAND|cwd'";
    exec(cmd, (err, stdout) => {
      console.log(`\nUnable to start server, process already running on PORT ${PORT || 8000}:\n`);
      if (err) {
        console.error(err);
        return;
      }
      console.log(stdout);
      process.exit(0);
    });
  }else{
    console.log(error);
  }
});