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
        references.push({ name: ref.model.toLowerCase() + "_id" });
      }
    });
  }

  var view = {
    classTitle: schema.title,
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
  };
  var output = mustache.render(template.toString(), view);

  return output;
}

module.exports = generateClass;
