const express = require('express');
const router = express.Router();

// status
router.get('/api/status', (req, res, next) => {
	res.status(200);
	res.json({ 
		'status' : 'ok'
	});
});

module.exports = router;
