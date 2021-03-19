const BirdModel = require(__root + '/models/birdModel');

async function getBirds(include=false){
    // return included birds only if set
    const birds = (include) ? 
        await BirdModel.find({ include: true }).sort({ common_name: 1 }): 
        await BirdModel.find().sort({ common_name: 1 });

    // build new obj so hasOwnProperty=true to make fields accessible with handlebars 
    let birdsObj = []
    birds.forEach(bird => {
        birdsObj.push(bird.toObject());
    });
    return birdsObj;
}

async function getBird(common_name){
    const bird = await BirdModel.findOne({ common_name: common_name }); 
    return bird.toObject(); // create new object so hasOwnProperty=true and fields accessible with handlebars
}

module.exports = {
    getBirds,
    getBird
}