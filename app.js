require('dotenv').config();
global.__root = __dirname; // set app root var for easier dir addressing
const PORT = process.env.PORT;
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
let testDB = process.argv.length == 3 && process.argv[process.argv.length-1] == "test";
const uri = testDB ? 
  process.env.MONGO_TEST_CONNECTION_URL : process.env.MONGO_PROD_CONNECTION_URL;
mongoose.connect(uri, { useNewUrlParser : true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false });
mongoose.connection.on('error', (error) => {
  console.log(error);
  process.exit(1);
});
mongoose.connection.on('connected', function () {
  testDB ? 
    console.log('Connected to mongo (test)') : 
    console.log('Connected to mongo');
});

// create instance of an express app
const app = express();
app.use(bodyParser.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(express.static(__dirname + '/assets')); // serve static html/css/js in /assets dir
app.use(cookieParser()); // cookies will be included in request object
app.use(fileUpload({
  limits: { fileSize: 1024 * 1024 }
}));

// view engine
app.engine('.hbs', handlebars({
  extname: '.hbs',
  helpers: require(__dirname + '/util/handlebarHelpers')
}));
app.set('view engine', '.hbs');

// public routes
app.use('/', [
    require(path.join(__dirname + '/api/public/main')),
    require(path.join(__dirname + '/api/public/users'))
]);

// secure user routes
app.use('/', 
  passport.authenticate('jwt', { session : false, failureRedirect: '/login' }), [
    require(path.join(__dirname + '/api/secure/main')),
    require(path.join(__dirname + '/api/secure/birds'))
]);

// admin routes
app.use('/', 
  passport.authenticate('jwt', { session : false, failureRedirect: '/login' }),
  checkAdminUser, [
    require(path.join(__dirname + '/api/admin/main')),
    require(path.join(__dirname + '/api/admin/database')),
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