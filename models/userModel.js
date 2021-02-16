const mongoose = require('mongoose')  // to connect to mongodb
const bcrypt = require('bcrypt');  // helper library for hashing passwords
const Schema = mongoose.Schema; // schema object provides built-in typecasting and validation
const validator = require('validator');
const BirdModel = require(__root + '/models/birdModel');
const shuffleInPlace = require('fisher-yates/inplace');

const UserSchema = new Schema({
  username : {
    type: String,
    required: true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    unique : true,
    validate: [validator.isEmail, 'Please enter a valid email']
  },
  password : {
    type : String,
    required : true
  },
  birdQueue : []
});

// called before a document is saved
UserSchema.pre('save', async function (next) {

  // hash password
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  // initialise bird queue
  this.birdQueue = await this.buildQueue();

  next();
});

// check given password against saved password hash
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// populate bird queue from db, and shuffle using fisher-yates algorithm
UserSchema.methods.buildQueue = async function () {
  let birds = await BirdModel.find();
  shuffleInPlace(birds);
  return birds;
};

// create and export user model
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
