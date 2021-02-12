const express = require('express');
const path = require('path');
const router = express.Router();

// status
router.get('/api/status', (req, res, next) => {
	res.status(200);
	res.json({ 
		'status' : 'ok'
	});
});

// index/login
router.get(['/', '/index', '/index.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/index.html'));
});

// signup
router.get(['/signup', '/signup.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/signup.html'));
});


// ADMIN ROUTES:
// const express = require('express');
// const router = express.Router();
const asyncMiddleware = require('../middleware/asyncMiddleware');
const admin = require('../controllers/admin.js');
const fileFunctions = require('../util/fileFunctions.js');
const csvtoJson = require('csvtojson');
const birdsCSV = 'data/birds.csv';

// set object-position page
router.get(['/admin/object-position', '/object-position.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/object-position.html'));
});

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
