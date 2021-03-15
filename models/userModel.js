const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;
const validator = require('validator');
const BirdModel = require(__root + '/models/birdModel');
const shuffleInPlace = require('fisher-yates/inplace');


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
  },
  lastTen : {
    type: [ BirdModel.BirdSchema ],
    required: true,
    default: []
  }
});


// get next bird sound from queue and return to queue
UserSchema.methods.getNextSound = async function (index) {
  // if bird already seen in this quiz push forward to next quiz
  let nextInQueue = await this.birdQueue.shift();
  let thisQuiz = this.lastTen.slice(10-index, 10).map(function(item){ 
    return item["common_name"];
  });
  let check = 1;
  while (thisQuiz.includes(nextInQueue.common_name)){
    let jumpIndex = 10 + (10 * (Math.floor(check/10)));
    this.returnToQueue(nextInQueue, jumpIndex);
    nextInQueue = await this.birdQueue.shift();
    check++;
  }
  // return next sound
  nextInQueue.seen_count ++;
  this.returnToQueue(nextInQueue, null);
  return await BirdModel.findOne({ common_name: nextInQueue.common_name })
  .then(bird => {
    this.addToLastTen(bird, nextInQueue.xeno_id);
    this.save();
    return {
      common_name : bird.common_name,
      scientific_name : bird.scientific_name,
      sound: bird.sounds.find(sound => sound.xeno_id == nextInQueue.xeno_id),
      images: bird.images
    }
  }).catch(err => console.log(err))  
};

// add sound to last ten array
UserSchema.methods.addToLastTen = function(bird, xeno_id) {
  let nextSound = {
    common_name : bird.common_name,
    scientific_name : bird.scientific_name,
    sounds: [ bird.sounds.find(sound => sound.xeno_id == xeno_id) ],
    images: bird.images
  }
  this.lastTen.push(nextSound);
  if (this.lastTen.length > 10){
    this.lastTen.shift();
  }
}

// return sound to queue based on seen_count
UserSchema.methods.returnToQueue = async function (sound, index=null) { 
  if (index == null){
    let len = this.birdQueue.length;
    if (len > 90){
      if(sound.seen_count <= 2){
        index = 15 + getRandomInt(1,5); // seen twice or less: repeat in ~1-2 quizzes
      }else if(sound.seen_count <= 5){
        index = 50 + getRandomInt(1,5); // seen up to 5 times: repeat in ~5 quizzes
      }else if(sound.seen_count <= 8){
        index = 80 + getRandomInt(1,10); // seen up to 8 times: repeat in ~8 quizzes
      }else{
        index = len; // seen more than 8 times, push to end of queue
      }
    }else{
      index = len; // if less than 90 sounds in queue, return to end of queue
    }
  }
  this.birdQueue.splice(index, 0, sound);
}
function getRandomInt(min, max) { // range inclusive
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

UserSchema.pre('save', async function (next) {
  // before first save- hash password and init user birdQueue
  if(this.isNew){
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    await this.initQueue();
  }
  next();
});

// check given password against saved password hash
UserSchema.methods.isValidPassword = async function (password) {
  const user = this;
  const compare = await bcrypt.compare(password, user.password);
  return compare;
};

// init queue from database
UserSchema.methods.initQueue = async function () {
  let birds = await BirdModel.find({include:true}, {common_name:true, sounds:true});
  let pools = {
    'L1' : [],
    'L2' : [],
    'L3' : [],
    'L4' : []
  }
  // build queue objects and split into difficulty pools
  birds.forEach(bird => {
    bird.sounds.forEach(sound => {
      pools['L'+sound.difficulty].push({
        common_name : bird.common_name,
        xeno_id : sound.xeno_id,
        difficulty : sound.difficulty,
        seenCount : 0
      });
    })
  })
  // shuffle each pool separately
  for (const [pool, sounds] of Object.entries(pools)) {
    shuffleInPlace(sounds);
  }
  // add shuffled sounds to user queue in order of difficulty
  for (const [pool, sounds] of Object.entries(pools)) {
    sounds.forEach(sound => {
      this.birdQueue.push(sound);      
    });
  }
}

// update user queue from database
UserSchema.methods.updateQueue = async function () {
  let birds = await BirdModel.find({include:true}, {common_name:true, sounds:true});
  birds.forEach(bird => {
    bird.sounds.forEach(sound => {
      let exists = this.birdQueue.find(el => el.xeno_id == sound.xeno_id);
      if(exists === undefined){
        this.birdQueue.push({
          common_name : bird.common_name,
          xeno_id : sound.xeno_id,
          difficulty : sound.difficulty,
          seenCount : 0
        })
      }
    })
  })
  this.save();
};

// empty user queue
UserSchema.methods.emptyQueue = async function () {
  for (let i = this.birdQueue.length-1; i >= 0; --i) {
    this.birdQueue.splice(i, 1);
  }
  this.save();
};

// create and export user model
const UserModel = mongoose.model('user', UserSchema);
module.exports = UserModel;
