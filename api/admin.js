const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');
const router = express.Router();
const fs = require('fs');
const csvToJson = require('convert-csv-to-json');
const unirest = require('unirest');


// create json from csv
router.get('/api/admin/create-birds-json', asyncMiddleware( async (req, res, next) => {

    // get json of scientific names from NBN bird list csv
    let csv_path = 'data/NBN_bird_list.csv';
    let birds_json = csvToJson.fieldDelimiter(',').getJsonFromCsv(csv_path);        

    // loop through species list and populate json from NBN species lookup
    for(let i=0; i<birds_json.length; i++){
        let bird = await nbn_species_lookup(birds_json[i].nbn_guid);
        for (let [key, value] of Object.entries(bird)) {
            birds_json[i][key] = value;
        }
    }

    // if birds.json already exists, move to archive
    let birds_path = 'data/birds.json';
    let timestamp = await timeStamp();
    let archive_path = 'data/archive/birds_'+timestamp+'.json';
    await archive_birds_json(birds_path, archive_path);

    // write json to file
    fs.writeFile(birds_path, JSON.stringify(birds_json), 
        err => {
            if (err) {
                res.status(404);
                res.json({ 
                    'status' : 'error',
                    'message' : 'error writing file'
                });
            } else {
                res.status(200);
                res.json({ 
                    'status' : 'ok',
                    'message' : 'json created'
                });            
            }
        }
    )
}));

// view current birds.json
router.get('/api/admin/view-birds-json', asyncMiddleware( async (req, res, next) => {
    fs.readFile('data/birds.json', (err, data) => {
        if (err) {
            res.status(404);
            res.json({ 
                'status' : 'error',
                'message' : 'error reading json'
            });
        };
        let birds_json = JSON.parse(data);
        res.status(200);
        res.json({ 
            'status' : 'ok',
            'birds' : birds_json
        });
    });
}));

// init db from json
router.get('/api/admin/init-db', asyncMiddleware( async (req, res, next) => {
  
    // empty db
    await BirdModel.deleteMany({})
    .catch(function(err){ 
        console.log('Problem clearing database', err);
    });

    // populate db from json
    var content = await fs.readFileSync("data/birds.json");
    var json = await JSON.parse(content);
    for(let i in json) {
        await BirdModel.create(json[i])
        .catch(function(err){ 
            console.log('Problem updating database', err);
        });
    }

    // update user queues of all users to reflect new db
    for await (const user of UserModel.find()) {
        let birdQueue = await user.buildQueue();
        user.birdQueue = birdQueue;
        await user.save();
    }

    res.status(200);
	res.json({ 
        'status' : 'ok',
        'message' : 'database and user queues updated'
	});
}));


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

async function archive_birds_json(birds_path, archive_path){
    try {
        if (fs.existsSync(birds_path)) {
            fs.rename(birds_path, archive_path, function (err) {
                if (err) {
                    console.log('problem archiving file');
                    throw err;
                }
            })
        }
    } catch(err) {
        console.error(err)
    }
}

async function nbn_species_lookup(nbn_guid){

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
        for(let i=0; i<bird.commonNames.length; i++){
            if(bird.commonNames[i].language === 'en'){
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
        console.log('Error', err)
        return {error: err};
    });

    return bird_json;
}


module.exports = router;