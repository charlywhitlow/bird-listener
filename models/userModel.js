const mongoose = require('mongoose')  // to connect to mongodb
const bcrypt = require('bcrypt');  // helper library for hashing passwords

const Schema = mongoose.Schema; // schema object provides built-in typecasting and validation

const UserSchema = new Schema({
  username : {
    type: String,
    required: true,
    unique : true
  },
  email : {
    type : String,
    required : true,
    unique : true
  },
  password : {
    type : String,
    required : true
  }
});

// called before a document is saved- hash password
UserSchema.pre('save', async function (next) {
  const user = this;
  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

// check given password against saved password hash
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
}

// create and export user model
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
