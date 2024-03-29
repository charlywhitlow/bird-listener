const express = require('express');
const csvtoJson = require('csvtojson');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const BirdModel = require(__root + '/models/birdModel');
const UserModel = require(__root + '/models/userModel');
const adminUtil = require(__root + '/controllers/admin.js');
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

    // get additional fields and return json to browser
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
router.post('/api/admin/upload-images-csv', asyncMiddleware( async (req, res, next) => {
    let uploadPath = uploadDir + 'add-images.csv';
    let expectedHeaders = ['common_name', 'image_info_url', 'image_name'];

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
    // get additional fields, update CSV, and return json to browser
    birds = await adminUtil.getImageDetails(birds)
    .catch((err) => {
        console.log(err)
        return res.status(400).json({ 
            'status' : 'failed',
            'message' : 'Problem getting additional fields from Wikimedia Commons API'
        })
    })
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
                    { upsert: true }) // add values which don't already exist
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

// 2b. Save JSON of bird sounds to database
router.post('/api/admin/save-sounds', asyncMiddleware( async (req, res, next) => {
    let sounds = req.body;
    let dbErrors = []
    for(let i in sounds) {
        if (! await BirdModel.exists({ common_name: sounds[i].common_name })){
            dbErrors.push(
                `${sounds[i].common_name} - bird not in database - add names first`)
        }else{
            let recording = sounds[i]
            let common_name = recording.common_name;
            delete recording.common_name;

            // push new recordings / update existing (determined by xeno_id)
            let recordingExists = await BirdModel.exists({ 'common_name' : common_name, 'sounds.xeno_id' : recording.xeno_id })
            if (recordingExists){
                console.log('update sound...')
                await BirdModel.findOneAndUpdate(
                    { 'common_name' : common_name, 'sounds.xeno_id' : recording.xeno_id},
                    { '$set' : { 'sounds.$' : recording } }
                ).catch(function(err){
                    dbErrors.push(err.message)
                });
            }else{
                console.log('add new sound...')
                await BirdModel.findOneAndUpdate(
                    { common_name: common_name },
                    { $addToSet: { sounds : recording } },
                    { upsert: true }
                ).catch(function(err){
                    dbErrors.push(err.message)
                });
            }
        }
    }
    if (dbErrors.length>0){
        return res.status(200).json({ 
            'status' : 'error',
            'message' : 'Errors',
            'errors' : dbErrors
        });
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'Database updated'
    });
}));

// 2c. Save JSON of bird images to database
router.post('/api/admin/save-images', asyncMiddleware( async (req, res, next) => {
    let images = req.body;
    let dbErrors = []
    for(let i in images) {
        if (! await BirdModel.exists({ common_name: images[i].common_name })){
            dbErrors.push(
                `${images[i].common_name} - bird not in database - add names first`)
        }else{
            let image = images[i]
            let common_name = image.common_name;
            delete image.common_name;
            delete image.image_author_raw;

            // push new recordings / update existing (determined by image_url)
            let imageExists = await BirdModel.exists({ 'common_name' : common_name, 'images.image_url' : image.image_url })
            if (imageExists){
                console.log('update image...')
                await BirdModel.findOneAndUpdate(
                    { 'common_name' : common_name, 'images.image_url' : image.image_url},
                    { '$set' : { 'images.$' : image } }
                ).catch((err) => {
                    console.log(err)
                    dbErrors.push(err.message)
                });
            }else{
                console.log('add new image...')
                await BirdModel.findOneAndUpdate(
                    { common_name: common_name },
                    { $addToSet: { images : image } },
                    { upsert: true }
                ).catch((err) => {
                    console.log(err)
                    dbErrors.push(err.message)
                });
            }
        }
    }
    if (dbErrors.length>0){
        return res.status(200).json({ 
            'status' : 'error',
            'message' : 'Errors',
            'errors' : dbErrors
        });
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'Database updated'
    });
}));

// 3. Update user queues from database
router.get('/api/admin/update-user-queues', asyncMiddleware( async (req, res, next) => {
    let dbErrors = [];

    // loop through user.birdQueue and append any sounds not in queue
    for await (const user of await UserModel.find()) {
        await user.updateQueue().catch(err => {
            console.log(err)
            dbErrors.push(err.message)
        })
    }
    if (dbErrors.length>0){
        return res.status(200).json({ 
            'status' : 'error',
            'message' : 'Errors',
            'errors' : dbErrors
        });
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'User queues updated'
    });
}));

// 4a. empty birds table, empty user queues, and clean indexes
router.get('/api/admin/empty-birds-table', asyncMiddleware( async (req, res, next) => {
    // empty birds table
    await BirdModel.deleteMany({})
    .catch(function(err){
        return res.status(400).json({ 
            'status' : 'error',
            'message' : 'Problem clearing database',
            'error' : err
        });
    });
    // clean indexes
    await BirdModel.cleanIndexes()
    .catch(function(err){
        return res.status(400).json({ 
            'status' : 'error',
            'message' : 'Problem clearing indexes',
            'error' : err
        });
    });
    // empty user queues
    for await (const user of await UserModel.find()) {
        await user.emptyQueue().catch(err => {
            console.log(err)
            dbErrors.push(err.message)
        })
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'Birds table and user queues emptied'
    });
}));

// 4b. empty user queues
router.get('/api/admin/empty-queues', asyncMiddleware( async (req, res, next) => {
    for await (const user of await UserModel.find()) {
        await user.emptyQueue().catch(err => {
            console.log(err)
            dbErrors.push(err.message)
        })
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'User queues emptied'
    });
}));

module.exports = router;