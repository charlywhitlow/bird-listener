const BirdModel = require(__root + '/models/birdModel');

async function getBirds(){
    const birds = await BirdModel.find().sort({common_name:1});

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