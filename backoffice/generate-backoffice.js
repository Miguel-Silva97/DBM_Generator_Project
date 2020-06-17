const mustache = require("mustache");
const fs = require("fs");
const template = fs.readFileSync("./backoffice/backoffice.mustache");

function generateBackofficeApi(schemaName) {
  var view = {
    title: schemaName,
  };

  var output = mustache.render(template.toString(), view);

  return output;
}

module.exports = generateBackofficeApi;
