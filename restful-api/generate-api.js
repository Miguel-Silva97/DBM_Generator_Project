const mustache = require("mustache");
const fs = require("fs");
const template = fs.readFileSync("./restful-api/api.mustache");

function generateApi(schema) {
  var schemaReq = require("../schemas/Schema-" + schema + ".json");
  let arrayMany = [];
  let arrayRelations = [];
  let dateVariables = [];

  Object.keys(schemaReq.properties).forEach((prop) => {
    if (prop.toLowerCase().includes("date")) {
      dateVariables.push({ name: prop });
    }
  });

  if (schemaReq.references) {
    schemaReq.references.forEach((ref) => {
      if (ref.relation === "M-M") {
        arrayMany.push({ name: ref.model + "Array" });
      } else {
        arrayRelations.push({ name: ref.model.toLowerCase() + "_id" });
      }
    });
  }
  var view = {
    classTitle: schema,
    arrayrefs: arrayMany,
    arrayRelations: arrayRelations,
    dates: dateVariables,
  };

  var output = mustache.render(template.toString(), view);

  return output;
}

module.exports = generateApi;
