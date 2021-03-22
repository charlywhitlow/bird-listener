const express = require('express');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const BirdModel = require(__root + '/models/birdModel');
const UserModel = require(__root + '/models/userModel');
const birds = require(__root + '/controllers/birds.js');
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

// get array of all bird common_names
router.get('/api/birds/get-bird-names', asyncMiddleware( async (req, res, next) => {
	const birds = await BirdModel.find( {include:true}, {_id:false, common_name:true}).sort({ common_name: 1 });
    res.status(200);
	res.json({ 
        'status' : 'ok',
        'birds' : birds.map(item => { return item.common_name })
	});
}));

// get next bird from user queue
router.post('/api/birds/get-next-bird', asyncMiddleware( async (req, res, next) => {
    let { username, index } = req.body;
    let user = await UserModel.findOne({'username': username}).catch(err => console.log(err));
    let nextSound = await user.getNextSound(index);
    res.status(200);
	res.json({ 
        'status' : 'ok',
        'message' : 'bird retrieved and returned to queue',
        'nextBird' : nextSound
	});
}));

// get next page of birds
router.post('/api/birds/load-more', asyncMiddleware( async (req, res, next) => {
    let json = await birds.getBirds(req.body.page);
    let html = [];
    var count = 0;
    json.birds.forEach(bird => {
        res.render(__root + '/views/partials/bird-panel', 
            {layout: false, bird: bird}, 
            (err, birdPanel) => {
                if(err){
                    return console.error(err);
                }
                html.push(birdPanel)
                count++;
                if(count === json.birds.length) {
                    res.json({
                        'birds' : html,
                        'lastPage' : json.lastPage
                    });
                }
            }
        );
    });
}));

// matching birds html
router.post('/api/birds/load-matching-birds', asyncMiddleware( async (req, res, next) => {
    let birdsObj = await birds.getMatchingBirds(req.body);
    let html = [];
    var count = 0;
    birdsObj.forEach(bird => {
        res.render(__root + '/views/partials/bird-panel', 
            {layout: false, bird: bird}, 
            (err, birdPanel) => {
                if(err){
                    return console.error(err);
                }
                html.push(birdPanel)
                count++;
                if(count === birdsObj.length) {
                    res.json({
                        'birds' : html
                    });
                }
            }
        );
    });
}));


module.exports = router;