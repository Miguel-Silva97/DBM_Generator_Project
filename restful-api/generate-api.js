const mustache = require("mustache");
const fs = require("fs");
const template = fs.readFileSync("./restful-api/api.mustache");

function generateApi(schema) {
  var view = {
    classTitle: schema,
  };

  var output = mustache.render(template.toString(), view);

  return output;
}

module.exports = generateApi;
