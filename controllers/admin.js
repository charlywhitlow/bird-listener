const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const unirest = require('unirest');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');

const birdsJSON = 'data/birds.json';
const birdsCSV = 'data/NBN_bird_list.csv';


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

    // add additional fields from NBN:
    birds_json = await addNBNFields(birds_json);
    if (birds_json.error) {
        return {
            "message": "error extracting NBN data",
            "error": error
        }
    }

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
    console.log(archive_path)

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

async function addNBNFields(birds_json){

    // loop through species list and populate json from NBN species lookup
    for(let i=0; i<birds_json.length; i++){
        let bird = await getNBNSpeciesData(birds_json[i].nbn_guid);
        for (let [key, value] of Object.entries(bird)) {
            birds_json[i][key] = value;
        }
    }
    return birds_json;
}

async function getNBNSpeciesData(nbn_guid){

    let bird_json = {
        "common_name" : "",
        "other_common_names" : [],
        "habitats" : [],
        "establishment_means" : "",
        "establishment_status" : ""
    };

    await unirest
    .get(`https://species-ws.nbnatlas.org/species/${nbn_guid}.json`)
    .headers({
        'Accept': 'application/json', 
        'Content-Type': 'application/json'
    })
    .then(response => {
        let bird = response.body;
        for (let i=0; i<bird.commonNames.length; i++){
            if (bird.commonNames[i].language === 'en'){
                if (bird.commonNames[i].status === 'preferred'){
                    bird_json.common_name = bird.commonNames[i].nameString;
                }else{
                    bird_json.other_common_names.push(bird.commonNames[i].nameString)
                }
            }
        }
        bird_json.habitats = bird.habitat_m_s;
        bird_json.establishment_means = bird.establishmentMeans;
        bird_json.establishment_status = bird.establishmentStatus_s;
    })
    .catch(err => {
        return {error: err};
    });

    return bird_json;
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