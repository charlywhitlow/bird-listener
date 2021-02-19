const express = require('express');
const csvtoJson = require('csvtojson');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const adminUtil = require(__root + '/controllers/admin-util.js');


// 1. Load CSV of bird names and add to database
router.post('/api/admin/add-names', asyncMiddleware( async (req, res, next) => {

    // save csv in uploads folder
    let uploadPath = __root + '/data/uploads/add-names.csv';
    let uploadError = adminUtil.uploadCSV(uploadPath, req)
    if (uploadError){
        return res.status(400).json(uploadError)
    }
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'CSV uploaded'
    });

}));


module.exports = router;