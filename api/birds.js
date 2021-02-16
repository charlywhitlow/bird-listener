const express = require('express');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const BirdModel = require(__root + '/models/birdModel');
const UserModel = require(__root + '/models/userModel');
const router = express.Router();


// add a bird to database
router.post('/api/birds/add', asyncMiddleware( async (req, res, next) => {
    const bird = req.body;
    await BirdModel.create(bird);
    res.status(200).json({ 
        'status': 'ok', 
        'message': 'bird added' 
    });
}));

// get all birds from db
router.get('/api/birds/all', asyncMiddleware( async (req, res, next) => {
	const birds = await BirdModel.find({});
    res.status(200);
	res.json({ 
        'status' : 'ok',
        'birds' : birds
	});
}));

// get specific bird from db
router.post('/api/birds/get', asyncMiddleware( async (req, res, next) => {
    const bird = await BirdModel.findOne(req.body);
	res.status(200);
	res.json({ 
        'status' : 'ok',
        'bird' : bird
	});
}));

// get next bird from user queue
router.post('/api/birds/get-next-bird', asyncMiddleware( async (req, res, next) => {

    // get next bird
    let username = req.body;
    let user = await UserModel.findOne(username);
    let nextBird = user.birdQueue.shift();

    // return bird to back of queue
    user.birdQueue.push(nextBird);
    await UserModel.updateOne(username, { birdQueue: user.birdQueue });

    res.status(200);
	res.json({ 
        'status' : 'ok',
        'message' : 'bird retrieved and moved to back of queue',
        'nextBird' : nextBird
	});
}));


module.exports = router;