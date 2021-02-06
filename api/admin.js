const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();
const admin = require('../controllers/admin.js');


// 1. Create birds.json from birds.csv
// This first moves existing data/birds.json to data/archive dir
// It then loads file data/birds.csv and writes it to file data/birds.json
router.get('/api/admin/create-birds-json', asyncMiddleware( async (req, res, next) => {
    let result = await admin.createBirdsJSON();

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

// 2. Update birds.json and birds.csv with image/sound info from wikimedia/xeno-canto
// This loads the current data/birds.json file
// It moves the current data/birds.json file to data/archive dir
// It uses the value in xeno_id column to extract recording info from Xeno-Canto
// It uses the value in image_info_url column to extract image info from Wikimedia Commons
// It writes the updated json to data/birds.json
// It writes the updated json to data/birds.csv
router.get('/api/admin/update-birds-json-and-csv', asyncMiddleware( async (req, res, next) => {
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

// 3. init db from json
router.get('/api/admin/init-db', asyncMiddleware( async (req, res, next) => {
    let result = await admin.buildDBFromJSON();
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


module.exports = router;