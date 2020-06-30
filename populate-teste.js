const Song = require("./Publish/Models/Song.js");
const Genre = require("./Publish/Models/Genre.js");
const Artist = require("./Publish/Models/Artist.js");
const Album = require("./Publish/Models/Album.js");

Genre.create().save();
Genre.create().save();
Genre.create().save();
Genre.create().save();
Genre.create().save();

Artist.create().save();
Artist.create().save();
Artist.create().save();
Artist.create().save();
Artist.create().save();

Album.create().save();
Album.create().save();
Album.create().save();
Album.create().save();
Album.create().save();

Song.create().save([1, 3]);
Song.create().save([2, 4]);
