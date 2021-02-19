const express = require('express');
const asyncMiddleware = require(__root + '/middleware/asyncMiddleware');
const router = express.Router();
const BirdModel = require(__root + '/models/birdModel');


// empty birds table and clean indexes
router.get('/api/admin/empty-db', asyncMiddleware( async (req, res, next) => {

    // empty birds table
    await BirdModel.deleteMany({})
    .catch(function(err){
        return res.status(400).json({ 
            'status' : 'error',
            'message' : 'Problem clearing database',
            'error' : err
        });
    });
    // clean indexes
    await BirdModel.cleanIndexes()
    .catch(function(err){
        return res.status(400).json({ 
            'status' : 'error',
            'message' : 'Problem clearing indexes',
            'error' : err
        });
    });
    res.status(200).json({ 
        'status' : 'ok',
        'message' : 'Database cleared'
    });
}));

module.exports = router;