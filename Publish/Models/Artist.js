
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

   save (callback){
      if(this.id)
         database.run("UPDATE Artist SET name = ?, email = ?, nationality = ?  WHERE id = ?", [this.name, this.email, this.nationality, this.id], callback);
      else
         database.run("INSERT INTO Artist (name, email, nationality) VALUES (?, ?, ?)", [this.name, this.email, this.nationality], callback);
   }
}

module.exports = Artist;
