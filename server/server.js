const fs = require("fs");
var del = require("del");
var mustache = require("mustache");
var mkdirp = require("mkdirp");
var childProcess = require("child_process");
var configData = require("./config.json");
var generateClass = require("../models/generate-class");
var databaseFunctions = require("../database/generate-database");
var generateApi = require("../restful-api/generate-api");
var generateBackofficeApi = require("../backoffice/generate-backoffice.js");
var generateDatabase = databaseFunctions.generateDatabase;
var generateRelationships = databaseFunctions.generateRelationships;

function generate() {
  del(["./Publish"]).then((paths) => {
    console.log("Deleted files and folder:\n", paths.join("\n"));
    mkdirp("./Publish/Controllers");
    mkdirp("./Publish/Models");
    mkdirp("./Publish/Public/css");
    mkdirp("./Publish/Public/images");
    mkdirp("./Publish/Public/js");
    mkdirp("./Publish/Views");
    mkdirp("./Publish/Database").then(() => {
      configData.staticFiles.forEach((path) => {
        fs.copyFileSync(path.originalPath, path.destinationPath);
      });
    });

    mkdirp("./Publish/Schemas").then(() => {
      configData.schemas.forEach((schema) => {
        fs.copyFileSync(
          schema.path,
          "./Publish/Schemas/Schema-" + schema.name + ".json"
        );

        fs.writeFileSync(
          "./Publish/Models/" + schema.name + ".js",
          generateClass(schema.path, configData.dbname)
        );

        generateDatabase(configData.dbname, schema.path);

        fs.writeFileSync(
          "./Publish/Controllers/" + schema.name + "-api.js",
          generateApi(schema.name)
        );

        fs.writeFileSync(
          "./Publish/Controllers/" + schema.name + "-backoffice-api.js",
          generateBackofficeApi(schema.name)
        );
      });

      fs.readFile("./server/server.mustache", function (err, data) {
        var apiNames = [];
        configData.schemas.forEach((schema) => {
          apiNames.push({ title: schema.name });
        });

        var view = {
          port: configData.port,
          api: apiNames,
        };
        var output = mustache.render(data.toString(), view);

        fs.writeFileSync("./Publish/index.js", output);
        childProcess.fork("./Publish/index.js");

        configData.schemas.forEach((schema) => {
          generateRelationships(configData.dbname, schema.path);
        });
      });
    });
  });
}

module.exports = generate;
