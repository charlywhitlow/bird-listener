const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bird_json = {
  "level": "1",
  "xeno_id": "27236",
  "common_name": "Swift",
  "international_common_name": "Common Swift",
  "scientific_name": "Apus apus",
  "sound_url": "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/Tornseglaresommarflock.mp3",
  "sonogram_url": "https://www.xeno-canto.org/sounds/uploaded/BPSDQEOJWG/ffts/XC27236-med.png",
  "cc_license_url": "https://creativecommons.org/licenses/by-nc-sa/3.0/",
  "cc_license_code": "BY-NC-SA 3.0",
  "recordist": "Patrik Åberg",
  "location": "Källedalen, Fröstorp, Tibro, Västergötland",
  "download_link": "https://www.xeno-canto.org/27236/download",
  "filename": "Tornseglaresommarflock.mp3"
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
  sonogram_url : {
    type : String,
    required : true,
    unique : true
  },
  cc_license_url: {
    type : String,
    required : true,
    unique : false
  },
  cc_license_code: {
    type : String,
    required : true,
    unique : false
  },
  recordist: {
    type : String,
    required : true,
    unique : false    
  },
  level : {
    type: Number,
    required : false,
    unique: false
  }
  // sounds : []
  // images : [],
});

// create and export user model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
