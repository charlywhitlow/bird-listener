const express = require('express');
const router = express.Router();


// status
router.get('/api/status', (req, res, next) => {
	res.status(200);
	res.json({ 
		'status' : 'ok'
	});
});

// admin dashboard
router.get('/admin/dashboard', function (req, res) {
    res.render('admin/dashboard', {layout: false});
});

// object-position
router.get('/admin/object-position', function (req, res) {
    res.render('admin/object-position', {layout: false});
});

module.exports = router;
