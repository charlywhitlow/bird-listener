const express = require('express');
const router = express.Router();
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const birds = require(__root + '/controllers/birds.js');


// menu
router.get(['/menu','/menu.html'], function (req, res) {
    res.render('menu', {layout: false, admin: req.user.admin});
});

// browse
router.get(['/browse','/browse.html'], asyncMiddleware( async (req, res, next) => {
	let birdsJson = await birds.getBirds();
    res.render('browse', {layout: false, birds: birdsJson});
}));

// quiz
router.get(['/quiz','/quiz.html'], function (req, res) {
    res.render('quiz', {layout: false});
});

// quiz-gallery
router.get(['/quiz-gallery','/quiz-gallery.html'], function (req, res) {
    res.render('quiz-gallery', {layout: false});
});

// about
router.get(['/about','/about.html'], function (req, res) {
    res.render('about', {layout: false});
});

// settings
router.get(['/settings','/settings.html'], function (req, res) {
    res.render('settings', {layout: false});
});


module.exports = router;
