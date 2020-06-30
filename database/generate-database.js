const mustache = require("mustache");
const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const template = fs.readFileSync("./database/dbscript.mustache");
const templateOneToMany = fs.readFileSync("./database/one-to-many.mustache");
const templateOneToOne = fs.readFileSync("./database/one-to-one.mustache");
const templateManyToMany = fs.readFileSync("./database/many-to-many.mustache");

function generateDatabase(databaseName, schemaPath) {
  var schema = require("." + schemaPath);
  let array = [];

  let types = {
    integer: "INTEGER",
    number: "REAL",
    string: "TEXT",
    date: "TEXT",
  };

  Object.keys(schema.properties).forEach((element, i, aux) => {
    let constraintString = "";
    let constraintAdded = false;
    constraintString += schema.properties[element].maxLength
      ? "CHECK(LENGTH(" +
        element +
        ") <= " +
        schema.properties[element].maxLength +
        ") "
      : "";

    if (schema.properties[element].minimum) {
      constraintString += schema.properties[element].minimum
        ? "CHECK(" + element + " >= " + schema.properties[element].minimum
        : "";
      constraintAdded = true;
    }

    if (schema.properties[element].maximum && constraintAdded) {
      constraintString +=
        " AND " + element + " <= " + schema.properties[element].maximum + ")";
    } else if (schema.properties[element].maximum && !constraintAdded) {
      constraintString +=
        "CHECK(" + element + " <= " + schema.properties[element].maximum + ")";
    } else if (!schema.properties[element].maximum && constraintAdded) {
      constraintString += ")";
    }

    array.push({
      name: element,
      type: types[schema.properties[element].type],
      required: schema.required.find((el) => {
        return element === el;
      })
        ? "NOT NULL"
        : "",
      unique: schema.properties[element].unique ? "UNIQUE" : "",
      constraint: constraintString,
      needComma: i !== aux.length - 1,
    });
  });

  let view = {
    tableName: schema.title,
    tableColumns: array,
  };

  let output = mustache.render(template.toString(), view);

  let db = new sqlite3.Database("./Publish/Database/" + databaseName, function (
    err
  ) {
    if (err) return console.error(err.message);
    console.log("Connected to SQLite database.");
  });
  db.run(output);

  db.close(function (err) {
    if (err) return console.error(err.message);
    console.log("Database connection closed.");
  });
}

function generateRelationships(databaseName, schemaPath) {
  var schema = require("." + schemaPath);
  let templateName = "";
  let view = {};
  let indexView = {};

  if (schema.references) {
    let db = new sqlite3.Database(
      "./Publish/Database/" + databaseName,
      function (err) {
        if (err) return console.error(err.message);
        console.log("Connected to SQLite database.");
      }
    );

    schema.references.forEach((reference) => {
      indexView = "";
      if (reference.relation === "1-M") {
        templateName = "one-to-many";
        view = {
          table: schema.title,
          referencedClassToLowerCase: reference.model.toLowerCase(),
          referencedClass: reference.model,
        };
      } else if (reference.relation === "1-1") {
        templateName = "one-to-one";
        view = {
          table: schema.title,
          referencedClassToLowerCase: reference.model.toLowerCase(),
        };
        indexView = {
          table: schema.title,
          referencedClassToLowerCase: reference.model.toLowerCase(),
          referencedClass: reference.model,
        };
      } else if (reference.relation === "M-M") {
        templateName = "many-to-many";
        view = {
          tableNameFirst: schema.title,
          tableNameSecond: reference.model,
          tableNameFirstLowerCase: schema.title.toLowerCase(),
          tableNameSecondLowerCase: reference.model.toLowerCase(),
        };
      }

      let template = fs.readFileSync(
        "./database/" + templateName + ".mustache"
      );
      let indexTemplate = fs.readFileSync("./database/one-to-many.mustache");
      let outputIndex = mustache.render(indexTemplate.toString(), indexView);

      let output = mustache.render(template.toString(), view);
      if (templateName !== "one-to-one") {
        db.serialize(() => {
          db.run(output);
        });
      } else if (templateName === "one-to-one") {
        db.serialize(() => {
          db.run(outputIndex);
          db.serialize(() => {
            db.run(output);
          });
        });
      }
    });

    db.close((err) => {
      if (err) {
        return console.error(err.message);
      }
      console.log("Close the database connection.");
    });
  }
}

module.exports = {
  generateDatabase,
  generateRelationships,
};
