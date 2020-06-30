var express = require('express');
var router = express.Router();

var Song = require('../Models/Song.js');

module.exports = router;

router.post('/', function(req,res){
    let created = Object.assign(new Song(), req.body.classe);
        let date = new Date(created.releaseDate);
        created.releaseDate = date;

        created.artist_id = req.body.classe.artist_id;
        console.log(req.body.classe.artist_id);
        created.album_id = req.body.classe.album_id;
        console.log(req.body.classe.album_id);
    
    
    created.save(req.body.arrays.GenreArray,  msg => res.status(201).send());
    
});



router.get('/', function (req, res) {
    Song.all(rows => {
        res.status(200);
        res.send(JSON.stringify(rows, Object.keys(new Song()).concat(["id"])));
    });
});

router.get('/:id', function (req, res) {
    Song.get(req.params.id, row => {
        res.status(200);
        res.send(JSON.stringify(row));
    }
    );
});

router.get('/:model/:id', function (req, res) {
 Song.many(req.params.model, req.params.id, rows => res.json(rows));
});


router.put('/:id', function (req, res) {
    Song.get(req.params.id, row => {
        let created = Object.assign(row, req.body.classe);
            let date = new Date(created.releaseDate);
            created.releaseDate = date;
            created.artist_id = req.body.classe.artist_id;
            console.log(req.body.classe.artist_id);
            created.album_id = req.body.classe.album_id;
            console.log(req.body.classe.album_id);
        created.save(req.body.arrays.GenreArray, msg => res.status(200).send());
    });
});

router.delete('/:id', function (req, res) {
    Song.delete(req.params.id, () => {
        res.send({ message: 'Deleted Successfully '});
    }
    );
});
