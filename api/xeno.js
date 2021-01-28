
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

// get individual bird
router.post('/api/xeno/get-bird', asyncMiddleware( async (req, res, next) => {

    let xeno_id = req.body.xeno_id;
    let bird_obj = await xeno.getBird(xeno_id);
    let recording_obj = xeno.extractBirdObj(bird_obj)

    res.status(200).json({ 
        'status': 'ok',
        'recording-obj' : recording_obj
    });
}));


module.exports = router;