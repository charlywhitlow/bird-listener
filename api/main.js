const express = require('express');
const router = express.Router();


// index / login
router.get(['/menu','/menu.html'], function (req, res) {
    res.render('menu', {layout: false});
});

// browse
router.get(['/browse','/browse.html'], function (req, res) {
    res.render('browse', {layout: false});
});

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

// object-position
router.get(['/admin/object-position','/admin/object-position.html'], function (req, res) {
    res.render('admin/object-position', {layout: false});
});


module.exports = router;
