const express = require('express');
const csvtoJson = require('csvtojson');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();
const admin = require('../controllers/admin.js');
const fileFunctions = require('../util/fileFunctions.js');
const birdsCSV = 'data/birds.csv';


// 1. Create/update birds.json from birds.csv
// This first moves existing data/birds.json to data/archive dir
// It then loads file data/birds.csv and writes it to file data/birds.json
router.get('/api/admin/create-birds-json-from-csv', asyncMiddleware( async (req, res, next) => {
    let result = await admin.createBirdsJSONFromCSV();

    if(result.error){
        res.status(404);
        res.json({ 
            'status' : 'error',
            'message' : result.error
        });
    }
    res.status(200);
    res.json({ 
        'status' : 'ok',
        'message' : result.message
    });
}));

// 2. Populate birds.json and birds.csv with image/sound info from wikimedia/xeno-canto
// This loads the current data/birds.json file
// It moves the current data/birds.json file to data/archive dir
// It uses the value in xeno_id column to extract recording info from Xeno-Canto
// It uses the value in image_info_url column to extract image info from Wikimedia Commons
// It writes the updated json to data/birds.json
// It writes the updated json to data/birds.csv
router.get('/api/admin/populate-birds-json-and-csv', asyncMiddleware( async (req, res, next) => {
        let result = await admin.updateBirdsJsonAndCsv();
        if(result.error){
            res.status(404);
            res.json({
                'status' : 'error',
                'message' : result.error
            });
        }
        res.status(200);
        res.json({
            'status' : 'ok',
            'message' : result.message
        });
    }));

// 3. Build db from csv
// This first loads the current `birds.csv` and uses it to update `birds.json`
// It then uses the updated `birds.json` file to build the database
router.get('/api/admin/init-db-from-csv', asyncMiddleware( async (req, res, next) => {
    let result = await admin.buildDBFromCSV();
    if(result.error){
        res.status(404);
        res.json({ 
            'status' : 'error',
            'message' : result.error
        });
    }
    res.status(200);
    res.json({ 
        'status' : 'ok',
        'message' : result.message
    });
}));

// 4. view current birds.json
// This loads and returns the current birds.json file
router.get('/api/admin/view-birds-json', asyncMiddleware( async (req, res, next) => {
    let result = await admin.getBirdsJSON();
    if (result.error){
        res.status(404);
        res.json({ 
            'status' : 'error',
            'message' : 'error reading birds.json',
            'error' : result.error
        });
    }
    res.status(200);
    res.json({ 
        'status' : 'ok',
        'birds' : result.birds
    });
}));

// get required fields for images where css object-position values haven't been set yet
router.get('/api/admin/get-blanks', asyncMiddleware( async (req, res, next) => {
	let result = await admin.getCssFields();
    if (result.error){
        res.status(404);
        res.json({ 
            'status' : 'error',
            'message' : 'error loading birds.csv',
            'error' : result.error
        });
    }
    res.status(200);
    res.json({ 
        'status' : 'ok',
        'blanks' : result.blanks
    });
}));

// update given css object-position values in birds.csv
router.post('/api/admin/update-csv', asyncMiddleware( async (req, res, next) => {

    // load birds.csv
    let birds = await csvtoJson().fromFile(birdsCSV);

    // loop through updates, and amend x and y values in birds json
    let {updates} = req.body;
    updates.forEach(update => {
        birds.find(bird => bird.common_name === update.common_name).image_css_x = update.image_css_x;
        birds.find(bird => bird.common_name === update.common_name).image_css_y = update.image_css_y;
    });

    // archive existing birds.csv
    let archived = await fileFunctions.archiveFile(birdsCSV);
    if (archived.error){
        console.log('error archiving csv:')
        console.log(archived.error)
        return {
            "message": "error archiving csv",
            "error": archived.error
        }
    }
   
    // write updates to csv
    let csvUpdated = await fileFunctions.writeCSV(birds, birdsCSV);
    if (csvUpdated.error){
        console.log('error writing csv:')
        console.log(csvUpdated.error)
        return {
            "message": "error writing csv",
            "error": csvUpdated.error
        }
    }
    res.status(200);
    res.json({ 
        'status' : 'ok',
        'blanks' : 'csv updated'
    });
}));


module.exports = router;