const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SoundSchema = new Schema({ 
  sound_name : {
    type: String, required : true
  },
  xeno_id : {
    type: Number, required : true, // unique: true
  },
  difficulty : {
    type: Number, required : true
  },
  sound_info_url: {
    type : String, required : true, // unique : true
  },
  sound_url: {
    type : String, required : true, // unique : true
  },
  sound_recordist: {
    type : String, required : true    
  },
  sound_license_url: {
    type : String, required : true
  },
  sound_license_code: {
    type : String, required : true
  }
});

const ImageSchema = new Schema({ 
  image_name : {
    type: String, required : true,
  },
  image_info_url : {
    type: String, required : true, // unique: true
  },
  image_url : {
    type: String, required : true, // unique: true
  },
  image_author: {
    type : String, required : true
  },
  image_license_code: {
    type : String, required : true
  },
  image_license_url: {
    type : String, required : true
  },
  image_css_x: {
    type : Number, required : true, default : 50
  },
  image_css_y: {
    type : Number, required : true, default : 50
  }
});

const BirdSchema = new Schema({
  common_name : {
    type: String,
    required: true,
    unique : true
  },
  scientific_name : {
    type : String,
    required : true,
    unique : true
  },
  sounds: {
    type: [SoundSchema],
    required : true,
    default: []
  },
  images: {
    type: [ImageSchema],
    required : true,
    default: []
  }
});

BirdSchema.pre('save', async function (next) {
  // console.log('PRE-SAVE')
  // if (this.sounds.length > 0){
  //   console.log('validate sounds')
  // }
  // if (this.images.length > 0){
  //   console.log('validate images')
  // }
  next();
});

BirdSchema.pre('findOneAndUpdate', async function (next) {
  // console.log('PRE-UPDATE')
  // if (this.sounds.length > 0){
  //   console.log('validate sounds')
  // }
  // if (this.images.length > 0){
  //   console.log('validate images')
  // }
  next();
});

// create and export model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
