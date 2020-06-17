
const database = require('../database/sqlite-wrapper.js')('./Publish/Database/labs.db');
const schemaGenre = require('../Schemas/Schema-Genre.json');
const jsf = require('json-schema-faker');
const faker = require('faker');
jsf.extend('faker', () => { return faker });



class Genre {
   constructor (name) {
   this.name = name;


   Object.defineProperty(this,"id", { enumerable: false, writable: true });

 }

   static create() {
    return Object.assign(new Genre(), jsf.generate(schemaGenre));
   }

   static all(callback){
      database.where("SELECT * FROM Genre", [] , Genre, callback);
   }

   static get(id, callback){
      database.get("SELECT * FROM Genre WHERE id = ?", [id], Genre, callback);
   }

   static delete(id, callback){
      database.run("DELETE FROM Genre WHERE id = ?", [id], callback);
   }

   save (callback){
      if(this.id)
         database.run("UPDATE Genre SET name = ?  WHERE id = ?", [this.name, this.id], callback);
      else
         database.run("INSERT INTO Genre (name) VALUES (?)", [this.name], callback);
   }
}

module.exports = Genre;
