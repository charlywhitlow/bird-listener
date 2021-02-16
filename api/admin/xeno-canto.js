const express = require('express');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const xeno = require(__root + '/controllers/xeno-canto.js');


// get recording info from xeno-canto by xeno id
// returns database fields by default, set 'all_fields' flag to return all fields
router.post('/api/xeno-canto/get-recording-info', asyncMiddleware( async (req, res, next) => {

    let xeno_id = req.body.xeno_id;
    let recording_info = (req.body.all_fields) ? 
        await xeno.getRecordingInfoAllFields(xeno_id) : 
        await xeno.getRecordingInfo(xeno_id);

    res.status(200).json({ 
        'status': 'ok',
        'recording' : recording_info
    });
}));


module.exports = router;