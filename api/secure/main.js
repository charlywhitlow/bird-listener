const express = require('express');
const router = express.Router();
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const birds = require(__root + '/controllers/birds.js');
const UserModel = require(__root + '/models/userModel.js');


// menu
router.get(['/menu','/menu.html'], function (req, res) {
    res.render('menu', {layout: false, admin: req.user.admin});
});

// browse
router.get(['/browse','/browse.html'], asyncMiddleware( async (req, res, next) => {
	let json = await birds.getBirds(true);
    res.render('browse', {layout: false, birds: json});
}));

// bird detail pages
router.get('/bird-detail/:common_name', asyncMiddleware( async (req, res, next) => {
    let bird = await birds.getBird(req.params.common_name);
    res.render('bird-detail', {layout: false, bird: bird});
}));

// quiz
router.get(['/quiz','/quiz.html'], function (req, res) {
    res.render('quiz', {layout: false});
});

// quiz-gallery
router.get(['/quiz-gallery','/quiz-gallery.html'], async function (req, res) {
    let user = await UserModel.findOne({_id: req.user._id});
    res.render('quiz-gallery', { layout: false, birds: user.lastTen });
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
