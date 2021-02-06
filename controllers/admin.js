const fs = require('fs');
const csvtoJson = require('csvtojson');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');
const xeno = require('./xeno-canto.js');
const birdsJSON = 'data/birds.json';
const birdsCSV = 'data/birds.csv';


// 1. create bird.json from birds.csv (creates backup of existing birds.json first)
async function createBirdsJSON(){

    // load birds.csv into json
    let birds_json = await csvtoJson().fromFile(birdsCSV);

    // archive existing birds.json
    let archived = await archiveBirdsJSON();
    if (archived.error){
        return {
            "message": "error archiving file",
            "error": error
        }
    }

    // write json to file
    let written = await writeJSON(birds_json);
    if (written.error){
        return {
            "message": "error writing file",
            "error": error
        }
    }
    return {
        "status":"ok",
        "message":"birds.json file updated"
    }
}

// 2. populate birds.json with image/sound info from xeno-canto / wikimedia
    // write updated json to file
    let written = await writeJSON(birds_json);
    if (written.error){
        return {
            "message": "error writing file",
            "error": error
        }
    }
    return {
        "status":"ok",
        "message":"birds.json file updated"
    }
}

// 3. build db from birds.json
async function buildDBFromJSON(){

    // empty db
    await BirdModel.deleteMany({})
    .catch(function(err){
        console.log('Problem clearing database');
        console.log(err);
    });
    await BirdModel.cleanIndexes();

    // populate db from json
    let content = await fs.readFileSync(birdsJSON);
    let json = await JSON.parse(content);
    for(let i in json) {
        await BirdModel.create(json[i])
        .catch(function(err){ 
            console.log('Problem updating birds database')
            console.log(err)
        });
    }

    // update user queues to reflect new db
    for await (const user of UserModel.find()) {
        let birdQueue = await user.buildQueue()
        await UserModel.findOneAndUpdate(
            { _id : user._id}, 
            { birdQueue: birdQueue }, 
            { useFindAndModify: false}
        )
        .catch(function(err){ 
            console.log('Problem updating user queues');
            console.log(err);
        });
    }
    return {
        "status": "ok",
        "message": "Database and user queues updated"
    }
}

// 4. return existing birds.json
async function getBirdsJSON(){
    return new Promise((resolve, reject) => {
        fs.readFile(birdsJSON, (err, data) => {
            if (err) {
                console.log('error:')
                console.log(err)
                return reject({
                    "status":"error",
                    "error": err
                });
            };
            let birds_json = JSON.parse(data);

            return resolve({
                "status": "ok",
                "birds": birds_json
            });
        });
    })
}
async function archiveBirdsJSON(){

    let timestamp = await timeStamp();
    let archive_path = 'data/archive/birds_json_'+timestamp+'.json';

    return new Promise((resolve, reject) => {
        if (fs.existsSync(birdsJSON)) {
            fs.rename(birdsJSON, archive_path, function (err) {
                if (err) {
                    return reject({
                        "status":"error",
                        "error": err
                    });
                }
            })
        }
        return resolve({
            "status": "ok"
        });
    })
}
async function timeStamp(){
    let date = new Date();
    let dateString = 
        date.getFullYear()+"-"+ 
        date.getMonth()+1+"-"+
        date.getDate()+"_"+
        date.getHours()+":"+
        date.getMinutes()+":"+
        date.getSeconds()

    return dateString;
}

async function addXenoFields(birds_json){

    // loop through species list and populate json with xeno-canto sound fields
    for(let i=0; i<birds_json.length; i++){
        let bird = await xeno.getSound_DatabaseFields(birds_json[i].xeno_id);
        for (let [key, value] of Object.entries(bird)) {
            birds_json[i][key] = value;
        }
    }
async function writeJSON(json, writePath=birdsJSON){
    return new Promise((resolve, reject) => {
        fs.writeFile(writePath, JSON.stringify(json), 
            err => {
                if (err) {
                    return reject({
                        'status':'error',
                        'error': err
                    });
                };
                return resolve({
                    'status': 'ok',
                    'message': 'json created'
                });
            }
        )
    })
}


module.exports = {
    getBirdsJSON,
    createBirdsJSON,
    buildDBFromJSON
}