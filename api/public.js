const express = require('express');
const router = express.Router();

// status
router.get('/api/status', (req, res, next) => {
	res.status(200);
	res.json({ 
		'status' : 'ok'
	});
});

// index / login
router.get(['/', '/index', '/index.html'], function (req, res) {
    res.render('index', {layout: false});
});

// signup
router.get(['/signup', '/signup.html'], function (req, res) {
    res.render('signup', {layout: false});
});


module.exports = router;
