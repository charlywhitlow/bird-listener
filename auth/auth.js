const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const jwtStrategy = require('passport-jwt').Strategy;
const UserModel = require('../models/userModel');
const userController = require('../controllers/users');

 
// handle signup
passport.use('signup',
    new localStrategy({
        usernameField: 'username',
        passwordField: 'password',
        passReqToCallback: true
    }, 
    async (req, username, password, done) => {
        try {
            const username = req.body.username.toLowerCase();
            const email = req.body.email.toLowerCase();
            const { password } = req.body;

            // email / username checks
            let email_check = await userController.checkEmailAvailable(email);
            if (email_check !== null) {
                return done(null, false, { message: 'Email already registered' });
            }
            let username_check = await userController.checkUsernameAvailable(username);
            if (username_check !== null) {
                return done(null, false, { message: 'Username taken' });
            }

            // attempt add to db
            const user = await UserModel.create({ 
                username: username, 
                email: email, 
                password 
            })
            .catch(function(err){
                return done(err, false, { message: 'Problem adding user to db' });
            });
            return done(null, user);

        } catch (error) {
            done(error);
        }
    }
));

// handle user login
passport.use('login', 
    new localStrategy({
        usernameField: 'username',
        passwordField: 'password'
    }, 
    async (username, password, done) => {
        try {
            // check given username against username and email in db
            let user = await UserModel.findOne({ username : username });
            if (!user) {
                user = await UserModel.findOne({ email : username });
            }
            if (!user) {
                return done(null, false, { message: 'User not found' });
            }
            // check password
            const validate = await user.isValidPassword(password);
            if (!validate) {
                return done(null, false, { message: 'Incorrect Password' });
            }
            return done(null, user, { message: 'Logged in Successfully' });
            
        } catch (error) {
            return done(error);
        }
    }
));
   
// verify token is valid
passport.use(
    new jwtStrategy({
        secretOrKey: 'top_secret', // used for signing the jwt that is created (TODO: move to env)
        
        // get jwt from the request object cookie
        jwtFromRequest: function (req) {
            // console.log('jwtFromRequest')

            let token = null;
            if (req && req.cookies) {
                // console.log('req and cookies')
                token = req.cookies['jwt'];
            }
            // console.log('token: '+token)
            return token;
        }
    },
    // success callback
    async (token, done) => {
        // console.log('token success callback')
        try {
            return done(null, token.user);
        } catch (error) {
            // console.log('token callback error')
            done(error);
        }
    }
));
