var express = require('express');
var router = express.Router();

var Album = require('../Models/Album.js');

module.exports = router;

router.post('/', function(req,res){
    let created = Object.assign(new Album(), req.body.classe);
        let date = new Date(created.releaseDate);
        created.releaseDate = date;

        created.artist_id = req.body.classe.artist_id;
        console.log(req.body.classe.artist_id);
    
    
    created.save( msg => res.status(201).send());
    
});



router.get('/', function (req, res) {
    Album.all(rows => {
        res.status(200);
        res.send(JSON.stringify(rows, Object.keys(new Album()).concat(["id"])));
    });
});

router.get('/:id', function (req, res) {
    Album.get(req.params.id, row => {
        res.status(200);
        res.send(JSON.stringify(row));
    }
    );
});

router.get('/:model/:id', function (req, res) {
 Album.many(req.params.model, req.params.id, rows => res.json(rows));
});


router.put('/:id', function (req, res) {
    Album.get(req.params.id, row => {
        let created = Object.assign(row, req.body.classe);
            let date = new Date(created.releaseDate);
            created.releaseDate = date;
            created.artist_id = req.body.classe.artist_id;
            console.log(req.body.classe.artist_id);
        created.save(msg => res.status(200).send());
    });
});

router.delete('/:id', function (req, res) {
    Album.delete(req.params.id, () => {
        res.send({ message: 'Deleted Successfully '});
    }
    );
});
