const express = require('express');
const router = express.Router();
const path = require('path');


// menu
router.get(['/menu','/menu.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/menu.html'));
});

// browse
router.get(['/browse','/browse.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/browse.html'));
});

// quiz
router.get(['/quiz','/quiz.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/quiz.html'));
});

// quiz-gallery
router.get(['/quiz-gallery','/quiz-gallery.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/quiz-gallery.html'));
});

// about
router.get(['/about','/about.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/about.html'));
});

// settings
router.get(['/settings','/settings.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/settings.html'));
});

// object-position
router.get(['/admin/object-position', '/object-position.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/object-position.html'));
});


module.exports = router;
