const express = require('express');
const csvtoJson = require('csvtojson');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const BirdModel = require(__root + '/models/birdModel');
const adminUtil = require(__root + '/controllers/admin-util.js');

const uploadPath = __root + '/data/uploads/add-names.csv';
const expectedHeaders = ['common_name', 'scientific_name'];

// 1. Load CSV of bird names
router.post('/api/admin/upload-names-csv', asyncMiddleware( async (req, res, next) => {

    // save csv in uploads folder
    let uploadError = adminUtil.uploadCSV(uploadPath, req)
    if (uploadError){
        return res.status(400).json(uploadError)
    }
    // check expected headers
    let birds = await csvtoJson().fromFile(uploadPath);
    let uploadHeaders = Object.keys(birds[0]);
    if (!adminUtil.checkCSVHeaders(expectedHeaders, uploadHeaders)){
        return res.status(400).json({ 
            'status' : 'failed',
            'message' : 'Expects required headings: '+JSON.stringify(expectedHeaders)
        })
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'CSV uploaded',
        'birds' : birds
    });
}));

// 2. Save JSON of bird names to database
router.post('/api/admin/save-names-to-db', asyncMiddleware( async (req, res, next) => {
    console.log('save to db')
   
    // get birds from csv:
    // let birds = await csvtoJson().fromFile(uploadPath);

    // get birds from json in request body
    let birds = req.body;
    let dbErrors = []
    for(let i in birds) {
        await BirdModel.create(birds[i])
        .catch(function(err){
            dbErrors.push(err.message)
        });
    }
    if (dbErrors.length>0){
        return res.status(200).json({ 
            'status' : 'error',
            'message' : 'Completed with errors',
            'errors' : dbErrors
        });
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'Database updated'
    });
}));

module.exports = router;