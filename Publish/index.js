const express = require("express");
const bodyParser = require("body-parser");
const mustacheExpress = require('mustache-express');

var app = express();
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.static(__dirname + '/Public'));

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache'); 
app.set('views', __dirname + '/Views'); 

const apiSong = require('./Controllers/Song-api.js');
app.use('/api/Song', apiSong);

const backofficeApiSong = require('./Controllers/Song-backoffice-api.js');
app.use('/backoffice', backofficeApiSong);
const apiAlbum = require('./Controllers/Album-api.js');
app.use('/api/Album', apiAlbum);

const backofficeApiAlbum = require('./Controllers/Album-backoffice-api.js');
app.use('/backoffice', backofficeApiAlbum);
const apiArtist = require('./Controllers/Artist-api.js');
app.use('/api/Artist', apiArtist);

const backofficeApiArtist = require('./Controllers/Artist-backoffice-api.js');
app.use('/backoffice', backofficeApiArtist);
const apiGenre = require('./Controllers/Genre-api.js');
app.use('/api/Genre', apiGenre);

const backofficeApiGenre = require('./Controllers/Genre-backoffice-api.js');
app.use('/backoffice', backofficeApiGenre);


var server = app.listen(8088,function () {
 var host = server.address().address === "::" ? "localhost" :
server.address().address
 var port = server.address().port
 console.log("Example app listening at http://%s:%s", host, port)
});
