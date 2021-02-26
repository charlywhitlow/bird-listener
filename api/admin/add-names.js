const express = require('express');
const csvtoJson = require('csvtojson');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const BirdModel = require(__root + '/models/birdModel');
const adminUtil = require(__root + '/controllers/admin-util.js');
const uploadDir = __root + '/data/uploads/';

// 1a. Upload CSV of bird names
router.post('/api/admin/upload-names-csv', asyncMiddleware( async (req, res, next) => {
    let uploadPath = uploadDir + 'add-names.csv';
    let expectedHeaders = ['common_name', 'scientific_name'];

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

// 1b. Upload CSV of bird sounds (and return json with additional fields)
router.post('/api/admin/upload-sounds-csv', asyncMiddleware( async (req, res, next) => {
    let uploadPath = uploadDir + 'add-sounds.csv';
    let expectedHeaders = ['common_name', 'xeno_id', 'sound_name', 'difficulty'];

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

    // get additional sound fields and return to browser
    birds = await adminUtil.getRecordingDetails(birds)
    .catch((err) => {
        console.log(err)
        return res.status(400).json({ 
            'status' : 'failed',
            'message' : 'Problem getting additional fields from Xeno-Canto'
        })
    })
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'CSV uploaded',
        'birds' : birds
    });
}));

// 1c. Upload CSV of bird images (and return json with additional fields)
router.post('/api/admin/upload-sounds-csv', asyncMiddleware( async (req, res, next) => {
    let uploadPath = uploadDir + 'add-images.csv';
    let expectedHeaders = ['common_name', 'image_info_url', 'image_ref'];

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

    // add additional fields
    //


    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'CSV uploaded',
        'birds' : birds
    });
}));


// 2a. Save JSON of bird names to database
router.post('/api/admin/save-names', asyncMiddleware( async (req, res, next) => {
    let birdNames = req.body;
    let dbErrors = []
    for(let i in birdNames) {
        if (await BirdModel.exists({ common_name: birdNames[i].common_name })){
            for (let key in birdNames[i]) {
                await BirdModel.findOneAndUpdate(
                    { common_name: birdNames[i].common_name }, // find bird by common_name
                    { $set: 
                        { key : birdNames[i][key] } // update each given key
                    },
                    { upsert: true, useFindAndModify: false }) // add values which don't already exist
                .catch(function(err){
                    dbErrors.push(err.message)
                });
            }
        }else{
            await BirdModel.create(birdNames[i])
            .catch(function(err){
                dbErrors.push(err.message)
            });
        }
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