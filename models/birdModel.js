const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const soundSchema = new Schema({ 
  xeno_id : {
    type: Number,
    required : true,
    unique: true
  },
  sound_url: {
    type : String,
    required : true,
    unique : true
  },
  sound_recordist: {
    type : String,
    required : true,
    unique : false    
  },
  sound_license_url: {
    type : String,
    required : true,
    unique : false
  },
  sound_license_code: {
    type : String,
    required : true,
    unique : false
  }
});

const imageSchema = new Schema({ 
  image_info_url : {
    type: String,
    required : true,
    unique: true
  },
  image_url : {
    type: String,
    required : true,
    unique: true
  },
  image_author: {
    type : String,
    required : true,
    unique : false
  },
  image_license_code: {
    type : String,
    required : true,
    unique : false
  },
  image_license_url: {
    type : String,
    required : true,
    unique : false
  },
  image_css_x: {
    type : Number,
    required : true,
    unique : false,
    default : 50
  },
  image_css_y: {
    type : Number,
    required : true,
    unique : false,
    default : 50
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
  sounds: [ soundSchema ],
  images: [ imageSchema ]
});

// create and export user model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
