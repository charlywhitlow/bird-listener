const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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
  }
});

// create and export user model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
