var express = require('express');
var router = express.Router();

var Artist = require('../Models/Artist.js');

module.exports = router;

router.post('/', function(req,res){
    let created = Object.assign(new Artist(), req.body.classe);

    
    
    created.save( msg => res.status(201).send());
    
});



router.get('/', function (req, res) {
    Artist.all(rows => {
        res.status(200);
        res.send(JSON.stringify(rows, Object.keys(new Artist()).concat(["id"])));
    });
});

router.get('/:id', function (req, res) {
    Artist.get(req.params.id, row => {
        res.status(200);
        res.send(JSON.stringify(row));
    }
    );
});

router.get('/:model/:id', function (req, res) {
 Artist.many(req.params.model, req.params.id, rows => res.json(rows));
});


router.put('/:id', function (req, res) {
    Artist.get(req.params.id, row => {
        let created = Object.assign(row, req.body.classe);
        created.save(msg => res.status(200).send());
    });
});

router.delete('/:id', function (req, res) {
    Artist.delete(req.params.id, () => {
        res.send({ message: 'Deleted Successfully '});
    }
    );
});
