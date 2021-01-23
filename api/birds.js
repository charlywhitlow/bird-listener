const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const BirdModel = require('../models/birdModel');
const router = express.Router();
const fs = require('fs');


// add a bird to database
router.post('/api/birds/add', asyncMiddleware( async (req, res, next) => {
    const bird = req.body;
    await BirdModel.create(bird);
    res.status(200).json({ 
        'status': 'ok', 
        'message': 'bird added' 
    });
}));

// get all birds
router.get('/api/birds/all', asyncMiddleware( async (req, res, next) => {
	const birds = await BirdModel.find({});
    res.status(200);
	res.json({ 
        'status' : 'ok',
        'birds' : birds
	});
}));

// get specific bird
router.post('/api/birds/get', asyncMiddleware( async (req, res, next) => {
    const bird = await BirdModel.findOne(req.body);
	res.status(200);
	res.json({ 
        'status' : 'ok',
        'bird' : bird
	});
}));

// init db from json
router.get('/api/birds/init-db', asyncMiddleware( async (req, res, next) => {
  
    // empty db
    await BirdModel.deleteMany({})
    .catch(function(err){ 
        console.log('Problem clearing database', err);
    });

    // populate db
    var content = await fs.readFileSync("config/data/birds.json");
    var json = await JSON.parse(content);
    for(let i in json) {
        await BirdModel.create(json[i])
        .catch(function(err){ 
            console.log('Problem updating database', err);
        });
    }

    res.status(200);
	res.json({ 
        'status' : 'ok',
        'message' : 'database updated'
	});
}));

module.exports = router;