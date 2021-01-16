const express = require('express');
const router = express.Router();
const path = require('path');


// homepage
router.get(['/', '/index', '/index.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/index.html'));
});

// menu
router.get(['/menu','/menu.html'], (req, res, next) => {
	res.sendFile(path.join(__dirname + '/../public/html/menu.html'));
});

// // login
// router.get(['/login', '/login.html'], (req, res, next) => {
// 	res.sendFile(path.join(__dirname + '/../public/html/login.html'));
// });

// // signup
// router.get(['/signup', '/signup.html'], (req, res, next) => {
// 	res.sendFile(path.join(__dirname + '/../public/html/signup.html'));
// });

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


module.exports = router;
