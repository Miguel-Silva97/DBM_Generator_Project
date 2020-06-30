const mustache = require("mustache");
const fs = require("fs");
const template = fs.readFileSync("./models/class.mustache");

function generateClass(schemaPath, databasename) {
  var schema = require("." + schemaPath);

  let arrayVariables = [];
  let classVariables = [];
  let enumerableVariables = [];
  let references = [];
  let updateStrings = "";
  let thisStrings = "";
  let variablesString = "";
  let totalVariablesString = "";
  let manyToManyReferences = [];
  let manyToManyBoolean = false;
  let referencesNotMany = [];

  Object.keys(schema.properties).forEach((element, i, aux) => {
    classVariables.push(element);
    arrayVariables.push({ name: element });
    if (i !== aux.length - 1) {
      updateStrings += element + " = ?, ";
      if (element.toLowerCase().includes("date")) {
        thisStrings += "this." + element + ".toISOString().substr(0, 10),";
      } else {
        thisStrings += "this." + element + ", ";
      }
      variablesString += element + ", ";
      totalVariablesString += "?, ";
    } else {
      updateStrings += element + " = ? ";

      if (element.toLowerCase().includes("date")) {
        thisStrings += "this." + element + ".toISOString().substr(0, 10)";
      } else {
        thisStrings += "this." + element;
      }
      variablesString += element;
      totalVariablesString += "?";
    }
  });

  classVariables.forEach((element) => {
    if (!schema.required.includes(element)) {
      enumerableVariables.push({ name: element });
    }
  });

  if (schema.references) {
    schema.references.forEach((ref) => {
      if (ref.relation == "1-M" || ref.relation == "1-1") {
        referencesNotMany.push(ref);
        references.push({ name: ref.model.toLowerCase() + "_id" });
      } else {
        manyToManyReferences.push({
          modelReferenced: ref.model,
          modelThis: ref.model.toLowerCase() + "_id",
        });
        manyToManyBoolean = true;
      }
    });
  }

  referencesNotMany.forEach((element, i, aux) => {
    if (i !== aux.length - 1) {
      variablesString += ", " + element.model.toLowerCase() + "_id";
      totalVariablesString += ", ?";
      thisStrings += ", this." + element.model.toLowerCase() + "_id";
      updateStrings += ", " + element.model.toLowerCase() + "_id = ?";
    } else {
      variablesString += ", " + element.model.toLowerCase() + "_id";
      totalVariablesString += ", ?";
      thisStrings += ", this." + element.model.toLowerCase() + "_id";
      updateStrings += ", " + element.model.toLowerCase() + "_id = ?";
    }
  });

  var view = {
    classTitle: schema.title,
    classTitleLowerCase: schema.title.toLowerCase(),
    constructorArguments: classVariables.join(),
    classConstructor: arrayVariables,
    classReferences: references,
    classEnumerables: enumerableVariables,
    dbname: databasename,
    primaryKey: "id",
    table: schema.title,
    updateVariables: updateStrings,
    thisVariables: thisStrings,
    variables: variablesString,
    totalVariables: totalVariablesString,
    manyToManyReferences: manyToManyReferences,
    manyToManyBoolean: manyToManyBoolean,
    tableThis: schema.title.toLowerCase() + "_id",
  };
  var output = mustache.render(template.toString(), view);

  return output;
}

module.exports = generateClass;
