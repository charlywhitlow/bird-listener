const express = require('express');
const router = express.Router();
const path = require('path');

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


module.exports = router;
