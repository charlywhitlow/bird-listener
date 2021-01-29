const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const unirest = require('unirest');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');

const birdsJSON = 'data/birds.json';


async function getBirdsJSON(){
    return new Promise((resolve, reject) => {
        fs.readFile('data/birds.json', (err, data) => {
            if (err) {
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

async function createBirdsJSON(){

    // archive existing birds.json
    let archived = await archiveBirdsJSON();
    if (archived.error){
        return {
            "message": "error archiving file",
            "error": error
        }
    }

    // create new birds.json from csv
    let birds_json = csvToJson.fieldDelimiter(',').getJsonFromCsv(birdsCSV);

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

async function archiveBirdsJSON(){

    let timestamp = await timeStamp();
    let archive_path = 'data/archive/birds_'+timestamp+'.json';

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


async function writeJSON(bird_json){
    return new Promise((resolve, reject) => {
        fs.writeFile(birdsJSON, JSON.stringify(bird_json), 
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

module.exports = {
    getBirdsJSON,
    createBirdsJSON,
    buildDBFromJSON
}