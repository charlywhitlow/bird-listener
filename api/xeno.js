
const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const router = express.Router();
const xeno = require('../controllers/xeno.js');


// get search url for all uk recordings of given bird
router.post('/api/xeno/species-search-url', asyncMiddleware( async (req, res, next) => {
    
    let scientific_name = req.body.scientific_name;
    let page = req.body.page ? req.body.page : 1;
    let url = xeno.speciesSearchURL(scientific_name, page);

    res.status(200).json({ 
        'status': 'ok',
        'url' : url
    });
}));

// get individual bird by xeno id (all fields / database fields only)
router.post('/api/xeno/get-bird', asyncMiddleware( async (req, res, next) => {

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