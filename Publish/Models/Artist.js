
const database = require('../database/sqlite-wrapper.js')('./Publish/Database/labs.db');
const schemaArtist = require('../Schemas/Schema-Artist.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
jsf.extend('faker', () => { return faker });



class Artist {
   constructor (name,email,nationality) {
   this.name = name;
   this.email = email;
   this.nationality = nationality;


   Object.defineProperty(this,"id", { enumerable: false, writable: true });

 }

   static create() {
    return Object.assign(new Artist(), jsf.generate(schemaArtist));
   }

   static all(callback){
      database.where("SELECT * FROM Artist", [] , Artist, callback);
   }

   static get(id, callback){
      database.get("SELECT * FROM Artist WHERE id = ?", [id], Artist, callback);
   }

   static delete(id, callback){
      database.run("DELETE FROM Artist WHERE id = ?", [id], callback);
   }

   static many(model, id, callback){
      let tablename = "Artist".localeCompare(model) === -1 ? "Artist_" + model : model
      + "_Artist";
      database.where(`SELECT Artist.*
      FROM Artist
      INNER JOIN ${tablename} ON ${tablename}.artist_id = Artist.id
      WHERE ${tablename}.${model.toLowerCase()}_id = ?`, [id],
      Artist, callback);
   }

   save (callback){
      if(false === false){
      if(this.id)
         database.run("UPDATE Artist SET name = ?, email = ?, nationality = ?  WHERE id = ?", [this.name, this.email, this.nationality, this.id], callback);
      else
         database.run("INSERT INTO Artist (name, email, nationality) VALUES (?, ?, ?)", [this.name, this.email, this.nationality], callback);
      } else {

         if(this.id){
             database.run("UPDATE Artist SET name = ?, email = ?, nationality = ?  WHERE id = ?", [this.name, this.email, this.nationality, this.id], callback);
         } else {
            database.run("INSERT INTO Artist (name, email, nationality) VALUES (?, ?, ?)", [this.name, this.email, this.nationality], (cb) => {
            });
            
         }

         
      }
   }
}

module.exports = Artist;
