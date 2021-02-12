const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let exampleJSON = {
  "common_name": "Swift",
  "international_common_name": "Common Swift",
  "scientific_name": "Apus apus",
  "level": "1",

  "xeno_id": "27236",
  "sound_url": "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/Tornseglaresommarflock.mp3",
  "sound_sonogram_url": "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/ffts/XC27236-med.png",
  "sound_license_url": "https://creativecommons.org/licenses/by-nc-sa/3.0/",
  "sound_license_code": "BY-NC-SA 3.0",
  "sound_recordist": "Patrik Åberg",

  "image_info_url": "https://commons.wikimedia.org/wiki/File:Apus_apus_-Barcelona,_Spain-8_(1).jpg",
  "image_url": "https://upload.wikimedia.org/wikipedia/commons/b/be/Apus_apus_-Barcelona%2C_Spain-8_%281%29.jpg",
  "image_author_raw": "<a rel=\"nofollow\" class=\"external text\" href=\"https://www.flickr.com/people/7686882@N08\">pau.artigas</a>",
  "image_author": "pau.artigas",
  "image_license_code": "CC BY-SA 2.0",
  "image_license_url": "https://creativecommons.org/licenses/by-sa/2.0",
  "image_css_x": 50,
  "image_css_y": 50
}

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
  level : {
    type: Number,
    required : false,
    unique: false
  },

  // sound
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
  },

  // image
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

// create and export user model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
