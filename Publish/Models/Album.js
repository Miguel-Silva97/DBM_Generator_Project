
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

   save (callback){
      if(this.id)
         database.run("UPDATE Album SET name = ?, releaseDate = ?, ean = ?, information = ?, label = ?, copyright = ?, totalLength = ?  WHERE id = ?", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength, this.id], callback);
      else
         database.run("INSERT INTO Album (name, releaseDate, ean, information, label, copyright, totalLength) VALUES (?, ?, ?, ?, ?, ?, ?)", [this.name, this.releaseDate.toISOString().substr(0, 10),this.ean, this.information, this.label, this.copyright, this.totalLength], callback);
   }
}

module.exports = Album;
