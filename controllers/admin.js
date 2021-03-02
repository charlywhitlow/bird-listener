const fs = require('fs');
const csvtoJson = require('csvtojson');
const BirdModel = require(__root + '/models/birdModel');
const UserModel = require(__root + '/models/userModel');
const xeno = require(__root + '/controllers/xeno-canto.js');
const wiki = require(__root + '/controllers/wikimedia.js');
const fileFunctions = require(__root + '/util/fileFunctions.js');

const birdsJSON = __root + 'data/birds.json';
const birdsCSV = __root + 'data/birds.csv';


// 1. create/update bird.json from birds.csv (creates backup of existing birds.json first)
async function createBirdsJSONFromCSV(csvFilePath=birdsCSV, jsonFilePath=birdsJSON){

    // load birds.csv into json
    let json = await csvtoJson().fromFile(csvFilePath);

    // archive existing birds.json file
    let archived = await fileFunctions.archiveFile(jsonFilePath);
    if (archived.error){
        return {
            "message": "error archiving file",
            "error": archived.error
        }
    }

    // write json to file
    let written = await fileFunctions.writeJSON(json, jsonFilePath);
    if (written.error){
        return {
            "message": "error writing json",
            "error": written.error
        }
    }
    return {
        "status":"ok",
        "message":"birds.json file updated"
    }
}

// 2. populate birds.json with image/sound info from xeno-canto / wikimedia
async function updateBirdsJsonAndCsv(csvFilePath=birdsCSV, jsonFilePath=birdsJSON){

    // load existing birds.json file
    let json = await getBirdsJSON()
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
    for (let i=0; i<json.length; i++){

        // add recording info
        let xeno_id = json[i].xeno_id;
        await xeno.getRecordingInfo(xeno_id)
        .catch(err => {
            console.log('err getting recording id '+xeno_id);
            console.log(err)
        })
        .then((recording_info) => {
            for (let [key, value] of Object.entries(recording_info)) {
                // only update from if value doesn't exist in csv, so doesn't overwrite manual updates
                if(!json[i][key]){
                    json[i][key] = value;
                }
            }
        });

        // add image info
        let image_info_url = wiki.extractMainImageInfoURL(json[i].image_info_url);
        json[i].image_info_url = image_info_url;

        // get image_url
        let image_url = await wiki.getImageURL(image_info_url);
        json[i].image_url = image_url;   

        // add image author and license fields
        await wiki.getImageInfo(image_info_url)
        .catch(err => {
            console.log('err getting image info '+image_info_url);
            console.log(err)
        })
        .then((image_info) => {
            for (let [key, value] of Object.entries(image_info)) {
                // only update if value doesn't exist in csv, so doesn't overwrite manual updates
                if(!json[i][key]){
                    json[i][key] = value;
                }
            }
        });
    }

    // archive existing birds.json, and replace with updated json
    let json_archived = await fileFunctions.archiveFile(jsonFilePath);
    if (json_archived.error){
        return {
            "message": "error archiving file",
            "error": json_archived.error
        }
    }
    let json_written = await fileFunctions.writeJSON(json, jsonFilePath);
    if (json_written.error){
        return {
            "message": "error writing json",
            "error": json_written.error
        }
    }

    // archive existing birds.csv, and replace with updated csv
    let csv_archived = await fileFunctions.archiveFile(csvFilePath);
    if (csv_archived.error){
        console.log('error archiving csv:')
        console.log(csv_archived.error)
        return {
            "message": "error archiving csv",
            "error": csv_archived.error
        }
    }
    let csv_written = await fileFunctions.writeCSV(json, csvFilePath);
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

// 3. build db from birds.csv
async function buildDBFromCSV(csvFilePath=birdsCSV, jsonFilePath=birdsJSON){
    await createBirdsJSONFromCSV(csvFilePath);
    await buildDBFromJSON(jsonFilePath);

    return {
        "status": "ok",
        "message": "Database and user queues updated from CSV"
    }
}
// build db from birds.json
async function buildDBFromJSON(jsonFilePath=birdsJSON){

    // empty db
    await BirdModel.deleteMany({})
    .catch(function(err){
        console.log('Problem clearing database');
        console.log(err);
    });
    await BirdModel.cleanIndexes();

    // populate db from json
    let content = await fs.readFileSync(jsonFilePath);
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
        let birdQueue = await user.initQueue()
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
        "message": "Database and user queues updated from JSON"
    }
}

// 4. return existing birds.json
async function getBirdsJSON(jsonFilePath=birdsJSON){
    return new Promise((resolve, reject) => {
        fs.readFile(jsonFilePath, (err, data) => {
            if (err) {
                console.log('error:')
                console.log(err)
                return reject({
                    "status":"error",
                    "error": err
                });
            };
            let json = JSON.parse(data);

            return resolve({
                "status": "ok",
                "birds": json
            });
        });
    })
}

// get rows in birds.csv with blanks for css fields (i.e. that need updating)
async function getCssFields(csvPath=birdsCSV){
    
    let blanks = await csvtoJson({
        includeColumns: 
            /(image_url|image_css_x|image_css_y|common_name|scientific_name)/
    }).fromFile(csvPath)
    .then(json => {
        let blanks = [];
        for (let i=0; i<json.length; i++){
            if (json[i].image_css_x === "" | json[i].image_css_x === ""){
                blanks.push(json[i])
            }
        }
        return blanks;
    });
    return {
        "status": "ok",
        "message": "Database and user queues updated from JSON",
        "blanks": blanks
    }
}


module.exports = {
    getBirdsJSON,
    createBirdsJSONFromCSV,
    updateBirdsJsonAndCsv,
    buildDBFromCSV,
    getCssFields
}