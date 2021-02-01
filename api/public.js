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

// homepage
router.get(['/', '/index', '/index.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/index.html'));
});

// login
router.get(['/login', '/login.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/login.html'));
});

// signup
router.get(['/signup', '/signup.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/signup.html'));
});


module.exports = router;
