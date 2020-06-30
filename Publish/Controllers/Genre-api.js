var express = require('express');
var router = express.Router();

var Genre = require('../Models/Genre.js');

module.exports = router;

router.post('/', function(req,res){
    let created = Object.assign(new Genre(), req.body.classe);

    
    
    created.save( msg => res.status(201).send());
    
});



router.get('/', function (req, res) {
    Genre.all(rows => {
        res.status(200);
        res.send(JSON.stringify(rows, Object.keys(new Genre()).concat(["id"])));
    });
});

router.get('/:id', function (req, res) {
    Genre.get(req.params.id, row => {
        res.status(200);
        res.send(JSON.stringify(row));
    }
    );
});

router.get('/:model/:id', function (req, res) {
 Genre.many(req.params.model, req.params.id, rows => res.json(rows));
});


router.put('/:id', function (req, res) {
    Genre.get(req.params.id, row => {
        let created = Object.assign(row, req.body.classe);
        created.save(msg => res.status(200).send());
    });
});

router.delete('/:id', function (req, res) {
    Genre.delete(req.params.id, () => {
        res.send({ message: 'Deleted Successfully '});
    }
    );
});
