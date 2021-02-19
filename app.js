const { PORT, MONGO_TEST_URL, MONGO_CONNECTION_URL } = require('./config/config');
global.__root = __dirname; // set app root var for easier dir addressing

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const { exec } = require('child_process');
const path = require('path');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const handlebars  = require('express-handlebars');
const passport = require('passport');
require('./auth/auth');
const { checkAdminUser } = require('./auth/checkAdminUser');

// setup mongo connection
// const uri = MONGO_CONNECTION_URL;
const uri = MONGO_TEST_URL; // test db
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
app.use(fileUpload({
  limits: { fileSize: 1024 * 1024 }
}));
// view engine
app.engine('.hbs', handlebars({extname: '.hbs'}));
app.set('view engine', '.hbs');

// public routes
app.use('/', [
    require(path.join(__dirname + '/api/public/main')),
    require(path.join(__dirname + '/api/public/users'))
]);

// secure user routes
app.use('/', 
  passport.authenticate('jwt', { session : false, failureRedirect: '/index' }), [
    require(path.join(__dirname + '/api/secure/main')),
    require(path.join(__dirname + '/api/secure/birds'))
]);

// admin routes
app.use('/', 
  passport.authenticate('jwt', { session : false, failureRedirect: '/index' }),
  checkAdminUser, [
    require(path.join(__dirname + '/api/admin/main')),
    require(path.join(__dirname + '/api/admin/add-names')),
    require(path.join(__dirname + '/api/admin/xeno-canto'))
]);
  
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