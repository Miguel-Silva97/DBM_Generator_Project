
const database = require('../database/sqlite-wrapper.js')('./Publish/Database/labs.db');
const schemaSong = require('../Schemas/Schema-Song.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
jsf.extend('faker', () => { return faker });



class Song {
   constructor (name,releaseDate,features,musicLength) {
   this.name = name;
   this.releaseDate = releaseDate;
   this.features = features;
   this.musicLength = musicLength;

   Object.defineProperty(this,"features", { enumerable: false });

   Object.defineProperty(this, "artist_id", { enumerable: false, writable: true });
   Object.defineProperty(this, "album_id", { enumerable: false, writable: true });
   Object.defineProperty(this,"id", { enumerable: false, writable: true });

 }

   static create() {
    return Object.assign(new Song(), jsf.generate(schemaSong));
   }

   static all(callback){
      database.where("SELECT * FROM Song", [] , Song, callback);
   }

   static get(id, callback){
      database.get("SELECT * FROM Song WHERE id = ?", [id], Song, callback);
   }

   static delete(id, callback){
      database.run("DELETE FROM Song WHERE id = ?", [id], callback);
   }

   static many(model, id, callback){
      let tablename = "Song".localeCompare(model) === -1 ? "Song_" + model : model
      + "_Song";
      database.where(`SELECT Song.*
      FROM Song
      INNER JOIN ${tablename} ON ${tablename}.song_id = Song.id
      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id],
      Song, callback);
   }

   save ( GenreArray, callback){
      if(true === false){
      if(this.id)
         database.run("UPDATE Song SET name = ?, releaseDate = ?, features = ?, musicLength = ? , artist_id = ?, album_id = ? WHERE id = ?", [this.name, this.releaseDate.toISOString().substr(0, 10),this.features, this.musicLength, this.artist_id, this.album_id, this.id], callback);
      else
         database.run("INSERT INTO Song (name, releaseDate, features, musicLength, artist_id, album_id) VALUES (?, ?, ?, ?, ?, ?)", [this.name, this.releaseDate.toISOString().substr(0, 10),this.features, this.musicLength, this.artist_id, this.album_id], callback);
      } else {

         if(this.id){
             database.run("UPDATE Song SET name = ?, releaseDate = ?, features = ?, musicLength = ? , artist_id = ?, album_id = ? WHERE id = ?", [this.name, this.releaseDate.toISOString().substr(0, 10),this.features, this.musicLength, this.artist_id, this.album_id, this.id], callback);
               
                  database.run("DELETE FROM Song_Genre WHERE song_id = ?", this.id, callback);

                  GenreArray.forEach(ref => {
                     database.run("INSERT INTO Song_Genre (song_id,genre_id) VALUES (? , ?)", [this.id, ref], callback);
                  });
         } else {
            database.run("INSERT INTO Song (name, releaseDate, features, musicLength, artist_id, album_id) VALUES (?, ?, ?, ?, ?, ?)", [this.name, this.releaseDate.toISOString().substr(0, 10),this.features, this.musicLength, this.artist_id, this.album_id], (cb) => {
                  GenreArray.forEach(ref => {
                     database.run("INSERT INTO Song_Genre (song_id,genre_id) VALUES (? , ?)", [cb.id, ref], callback);
                    });
            });
            
         }

         
      }
   }
}

module.exports = Song;
