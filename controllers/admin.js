const fs = require('fs');
const csvtoJson = require('csvtojson');
const { Parser } = require('json2csv');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');
const xeno = require('../controllers/xeno-canto.js');
const wiki = require('../controllers/wikimedia.js');

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
async function updateBirdsJsonAndCsv(){

    // load existing birds.json file
    let birds_json = await getBirdsJSON()
    .then((result)=>{
        return result.birds
    })
    .catch(err => {
        console.log('error loading birds.json:')
        console.log(err)
        return {
            "message": "error loading json",
            "error": err
        }
    });

    // add additional fields
    for (let i=0; i<birds_json.length; i++){

        // add recording info
        let xeno_id = birds_json[i].xeno_id;
        let recording_info = await xeno.getRecordingInfo(xeno_id)
        .catch(err => {
            console.log('err getting recording id '+xeno_id);
            console.log(err)
        });
        for (let [key, value] of Object.entries(recording_info)) {
            birds_json[i][key] = value;
        }

        // add image info
        let image_info_url = birds_json[i].image_info_url;
        let image_info = await wiki.getImageInfo(image_info_url)
        .catch(err => {
            console.log('err getting image info '+image_info_url);
            console.log(err)
        });
        for (let [key, value] of Object.entries(image_info)) {
            birds_json[i][key] = value;
        }
    }

    // archive existing birds.json
    let json_archived = await archiveBirdsJSON();
    if (json_archived.error){
        console.log('problem archiving birds.json:')
        console.log(json_archived.error)
        return {
            "message": "error archiving json",
            "error": json_archived.error
        }
    }
    // write updated json to file
    let json_written = await writeJSON(birds_json);
    if (json_written.error){
        console.log('problem writing json:')
        console.log(json_written.error)
        return {
            "message": "error writing json",
            "error": json_written.error
        }
    }
    // archive existing birds.csv
    let csv_archived = await archiveBirdsCSV();
    if (csv_archived.error){
        console.log('error archiving csv:')
        console.log(csv_archived.error)
        return {
            "message": "error archiving csv",
            "error": csv_archived.error
        }
    }
    // write updated csv to file
    let csv_written = await writeCSV(birds_json);
    if (csv_written.error){
        console.log('error writing csv:')
        console.log(csv_written.error)
        return {
            "message": "error writing csv",
            "error": csv_written.error
        }
    }
    return {
        "status":"ok",
        "message":"birds.json and birds.csv files updated"
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

// archive
async function archiveBirdsCSV(){
    
    let timestamp = await timeStamp();
    let archivePath = 'data/archive/'+'birds_csv_'+timestamp+'.csv';

    return new Promise((resolve, reject) => {
        if (fs.existsSync(birdsCSV)) {
            fs.rename(birdsCSV, archivePath, function (err) {
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

// write files
async function writeCSV(json, writePath=birdsCSV){
    return new Promise((resolve, reject) => {
        
        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(json);    

        fs.writeFile(writePath, csv,
            err => {
                if (err) {
                    return reject({
                        'status':'error',
                        'error': err
                    });
                };
                return resolve({
                    'status': 'ok',
                    'message': 'csv created'
                });
            }
        )
    })
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
    updateBirdsJsonAndCsv,
    buildDBFromJSON
}