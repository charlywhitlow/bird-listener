
const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();
const xeno = require('../controllers/xeno-canto.js');


// get recording info from xeno-canto by xeno id
// returns all fields by default, set 'database_fields' flat to return database fields only
router.post('/api/xeno-canto/get-recording-info', asyncMiddleware( async (req, res, next) => {

    let xeno_id = req.body.xeno_id;
    let recording_obj = (req.body.database_fields) ? 
        await xeno.getSound_DatabaseFields(xeno_id) : 
        await xeno.getSound_AllFields(xeno_id);

    res.status(200).json({ 
        'status': 'ok',
        'recording' : recording_obj
    });
}));


module.exports = router;