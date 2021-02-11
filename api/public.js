const express = require('express');
const router = express.Router();
const path = require('path');
const admin = require('../controllers/admin.js');
const asyncMiddleware = require('../middleware/asyncMiddleware');

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

// TEMP- object position (admin users only)
router.get(['/object-position', '/object-position.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/object-position.html'));
});


// TEMP- get css fields for images which haven't been set yet (admin users)
router.get('/api/admin/get-css-fields', asyncMiddleware( async (req, res, next) => {
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


module.exports = router;
