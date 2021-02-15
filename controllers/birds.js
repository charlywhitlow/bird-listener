const BirdModel = require('../models/birdModel');

async function getBirds(){
    const birds = await BirdModel.find();

    // build new obj so hasOwnProperty=true to make fields accessible with handlebars 
    let birdsObj = []
    birds.forEach(bird => {
        birdsObj.push(bird.toObject());
    });

    return birdsObj;
}

module.exports = {
    getBirds
}