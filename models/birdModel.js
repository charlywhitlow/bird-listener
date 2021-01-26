const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let bird_json = {
  "nbn_guid":"NHMSYS0000530119",
  "scientific_name":"Accipiter gentilis",
  "family":"Accipitridae",
  "common_name":"Goshawk",
  "other_common_names":[
    "Northern Goshawk",
  ],
  "habitats":[
    "terrestrial"
  ],
  "establishment_means":"Non-native",
  "establishment_status":"GB Establishment Status - Established"
}

const BirdSchema = new Schema({
  nbn_guid : {
    type: String,
    required: true,
    unique : true
  },
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
  family : {
    type: String,
    required: false,
    unique : false
  },
  establishment_means : {
    type: String,
    required: false,
    unique : false
  },
  establishment_status : {
    type: String,
    required: false,
    unique : false
  },
  habitats : [],
  other_common_names : [],
  images : [],
  sounds : []
});

// create and export user model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
