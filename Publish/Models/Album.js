
const database = require('../database/sqlite-wrapper.js')('./Publish/Database/labs.db');
const schemaAlbum = require('../Schemas/Schema-Album.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
jsf.extend('faker', () => { return faker });



class Album {
   constructor (name,releaseDate,ean,information,label,copyright,totalLength) {
   this.name = name;
   this.releaseDate = releaseDate;
   this.ean = ean;
   this.information = information;
   this.label = label;
   this.copyright = copyright;
   this.totalLength = totalLength;

   Object.defineProperty(this,"information", { enumerable: false });

   Object.defineProperty(this, "artist_id", { enumerable: false, writable: true });
   Object.defineProperty(this,"id", { enumerable: false, writable: true });

 }

   static create() {
    return Object.assign(new Album(), jsf.generate(schemaAlbum));
   }

   static all(callback){
      database.where("SELECT * FROM Album", [] , Album, callback);
   }

   static get(id, callback){
      database.get("SELECT * FROM Album WHERE id = ?", [id], Album, callback);
   }

   static delete(id, callback){
      database.run("DELETE FROM Album WHERE id = ?", [id], callback);
   }

   static many(model, id, callback){
      let tablename = "Album".localeCompare(model) === -1 ? "Album_" + model : model
      + "_Album";
      database.where(`SELECT Album.*
      FROM Album
      INNER JOIN ${tablename} ON ${tablename}.album_id = Album.id
      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id],
      Album, callback);
   }

   save (callback){
      if(false === false){
      if(this.id)
         database.run("UPDATE Album SET name = ?, releaseDate = ?, ean = ?, information = ?, label = ?, copyright = ?, totalLength = ? , artist_id = ? WHERE id = ?", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength, this.artist_id, this.id], callback);
      else
         database.run("INSERT INTO Album (name, releaseDate, ean, information, label, copyright, totalLength, artist_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength, this.artist_id], callback);
      } else {

         if(this.id){
             database.run("UPDATE Album SET name = ?, releaseDate = ?, ean = ?, information = ?, label = ?, copyright = ?, totalLength = ? , artist_id = ? WHERE id = ?", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength, this.artist_id, this.id], callback);
         } else {
            database.run("INSERT INTO Album (name, releaseDate, ean, information, label, copyright, totalLength, artist_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength, this.artist_id], (cb) => {
            });
            
         }

         
      }
   }
}

module.exports = Album;
