const express = require('express');
const asyncMiddleware = require('../middleware/asyncMiddleware');
const BirdModel = require('../models/birdModel');
const UserModel = require('../models/userModel');
const router = express.Router();
const fs = require('fs');


// create json from csv
// init db from json
router.get('/api/admin/init-db', asyncMiddleware( async (req, res, next) => {
  
    // empty db
    await BirdModel.deleteMany({})
    .catch(function(err){ 
        console.log('Problem clearing database', err);
    });

    // populate db from json
    var content = await fs.readFileSync("config/data/birds.json");
    var json = await JSON.parse(content);
    for(let i in json) {
        await BirdModel.create(json[i])
        .catch(function(err){ 
            console.log('Problem updating database', err);
        });
    }

    // update user queues of all users to reflect new db
    for await (const user of UserModel.find()) {
        let birdQueue = await user.buildQueue();
        user.birdQueue = birdQueue;
        await user.save();
    }

    res.status(200);
	res.json({ 
        'status' : 'ok',
        'message' : 'database and user queues updated'
	});
}));


async function timeStamp(){
module.exports = router;