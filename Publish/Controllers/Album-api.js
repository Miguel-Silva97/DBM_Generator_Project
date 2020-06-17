var express = require('express');
var router = express.Router();

var Album = require('../Models/Album.js');

module.exports = router;

router.post('/', function(req,res){
    let created = Object.assign(new Album(), req.body);
    created.save(msg => res.json(msg));

});

router.get('/', function (req, res) {
    Album.all(rows => {
        console.log(rows);
        res.status(200);
        res.send(JSON.stringify(rows));
    });
});

router.get('/:id', function (req, res) {
    Album.get(req.params.id, row => {
        res.status(200);
        res.send(JSON.stringify(row));
    }
    );
});

router.put('/:id', function (req, res) {
    Album.get(req.params.id, row => {
        let created = Object.assign(row, req.body);
        created.save(msg => res.json(msg));
    });
});

router.delete('/:id', function (req, res) {
    Album.delete(req.params.id, () => {
        res.send({ message: 'Deleted Successfully '});
    }
    );
});
