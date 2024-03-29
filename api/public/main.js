const express = require('express');
const router = express.Router();
const cors = require('cors');


// status
router.get('/api/status', cors(), (req, res, next) => {
	res.status(200);
	res.json({ 
		'status' : 'ok'
	});
});

// signup page
router.get(['/signup', '/signup.html'], function (req, res) {
    res.render('signup', {layout: false});
});

// login page
router.get(['/', '/login', '/login.html'], function (req, res) {
    res.render('login', {layout: false});
});


module.exports = router;