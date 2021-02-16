const express = require('express');
const router = express.Router();


// signup page
router.get(['/signup', '/signup.html'], function (req, res) {
    res.render('signup', {layout: false});
});

// login page
router.get(['/', '/index', '/index.html'], function (req, res) {
    res.render('index', {layout: false});
});


module.exports = router;