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

// add birds names
router.get('/admin/add-names', function (req, res) {
    res.render('admin/add-names', {
        layout: false, 
        type: 'names',
        expectedHeadings: 'common_name, scientific_name',
        afterCSVLoad: 'enableSaveButton'
    });
});

// add sounds
router.get('/admin/add-sounds', function (req, res) {
    res.render('admin/add-sounds', {
        layout: false,
        type: 'sounds',
        expectedHeadings: 'common_name, sound_info_url, sound_name, difficulty',
        afterCSVLoad: 'enableSaveButton'
    });
});

// add images
router.get('/admin/add-images', function (req, res) {
    res.render('admin/add-images', {
        layout: false,
        type: 'images',
        expectedHeadings: 'common_name, image_info_url, image_name',
        afterCSVLoad: 'enableSaveButton'
    });
});

// empty database
router.get('/admin/empty-database', function (req, res) {
    res.render('admin/empty-database', {layout: false});
});

// object-position
router.get('/admin/object-position', function (req, res) {
    res.render('admin/object-position', {layout: false});
});

module.exports = router;
