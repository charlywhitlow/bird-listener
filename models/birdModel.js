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
    type: Number, required : true, min: 1, max: 4
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
  },
  include : { 
    type: Boolean, // determines whether bird is ready for inclusion (i.e. contains sounds & images) 
    required : true, 
    default: false
  }
});


BirdSchema.post('findOneAndUpdate', async function(doc, next) {
  let updatedDoc = await this.model.findOne(this.getQuery());

  // bird newly ready for inclusion, set include and add to user queues
  if (updatedDoc.sounds.length > 0 && updatedDoc.images.length > 0 && updatedDoc.include === false){
    doc.set({ include: true });
    doc.save();
    // add to user queues
    // TODO
  }
  // bird no longer ready for inclusion, set include and remove from user queues
  if (updatedDoc.sounds.length === 0 && updatedDoc.images.length === 0 && updatedDoc.include === true){
    doc.set({ include: false });
    doc.save();
    // remove from user queues
    // TODO
  }
  // TODO: also need to remove sounds from user queues when removing single sounds (not just whole bird)
  //
  next();
});

// create and export model
const BirdModel = mongoose.model('bird', BirdSchema);
module.exports = BirdModel;
