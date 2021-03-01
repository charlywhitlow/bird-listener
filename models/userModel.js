const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');
const BirdModel = require(__root + '/models/birdModel');


// lists each sound in db: [common_name, xeno_id, difficulty, seenCount]
const birdsQueueSchema = new Schema({
  common_name : {
    type: String, required : true // not unique because multiple sounds
  },
  xeno_id :{
    type: String, required : true // unique: true
  },
  difficulty:{
    type: Number, required : true, min: 1, max: 4
  },
  seen_count:{
    type: Number, required : true, default: 0
  }
});
// birdsQueueSchema.index(
//   { common_name: 1, xeno_id: 1 }, // compound key
//   { unique: true }
// );

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
  admin : {
    type: Boolean,
    default: false  // set to true manually in mongo
  },
  birdQueue : {
    type: [ birdsQueueSchema ],
    required: true,
    default: []
  }    
});


// get next sound from queue
UserSchema.methods.getNextSound = async function () { 
  let nextSound = this.birdQueue.shift();
  nextSound.seen_count ++;
  this.returnToQueue(nextSound);
  return await BirdModel.findOne({common_name: nextSound.common_name})
  .then(bird => {
    return {
      common_name : bird.common_name,
      scientific_name : bird.scientific_name,
      sound: bird.sounds.find(sound => sound.xeno_id == nextSound.xeno_id),
      images: bird.images
    }  
  }).catch(err => console.log(err))  
};

// return sound to queue based on seen_count
UserSchema.methods.returnToQueue = async function (sound) { 
  let len = this.birdQueue.length;
  let index = 0;
  if (len > 35){
    if(sound.seen_count <= 2){
      index = 10 + getRandomInt(1,5);
    }else if(sound.seen_count <= 5){
      index = 15 + getRandomInt(1,5);
    }else if(sound.seen_count <= 8){
      index = 25 + getRandomInt(1,10);
    }else{
      index = len;
    }
  }else{
    index = len;
  }
  // return to queue at index
  this.birdQueue.splice(index, 0, sound);
  this.save();
}
function getRandomInt(min, max) { // range inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

UserSchema.pre('save', async function (next) {
  // hash password and create user queue before first save
  if(this.isNew){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    this.birdQueue = await this.buildQueue();  
  }
  next();
});

// check given password against saved password hash
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// populate user queue from database
UserSchema.methods.buildQueue = async function () {
  let birds = await BirdModel.find({include:true}, {common_name:true, sounds:true});
  let sounds = [];
  birds.forEach(bird => {
    bird.sounds.forEach(sound => {
      sounds.push({
        common_name : bird.common_name,
        xeno_id : sound.xeno_id,
        difficulty : sound.difficulty,
        seenCount : 0
      })
    })
  });  
  return sounds.sort(compareDifficulty);
};
function compareDifficulty(a, b){
  if (a.difficulty < b.difficulty) return -1;
  if (a.difficulty > b.difficulty) return 1;
  return 0;
}

// create and export user model
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
