var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var generate = require("./server/server");
var fs = require("fs");

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use(express.static("public")); //definição de uma pasta 'public' como estática

app.get("/index.htm", function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm"); //esta seria a página com oformulário
});

app.post("/generate", function (req, res) {
  generate();
});

app.get("/schemas/names", function (req, res) {
  fs.readdir("./schemas", (err, files) => {
    res.send(files);
  });
});

app.get("/schemas/properties/:name", function (req, res) {
  let rawData = fs.readFileSync(
    "./schemas/Schema-" + req.params.name + ".json"
  );
  let rawObject = JSON.parse(rawData);
  let stringProperties = "";
  Object.keys(rawObject.properties).forEach((prop) => {
    stringProperties += prop + ",";
  });

  res.status(200).send({ properties: stringProperties });
});

app.post("/schemas/edit/:schema", function (req, res) {
  let text = JSON.stringify(req.body, null, 2);
  try {
    fs.writeFileSync("./schemas/" + req.params.schema, text, "utf8");
    res.status(201).send();
  } catch {
    res.status(401).send();
  }
});

app.post("/schemas/add/:schema", function (req, res) {
  let text = JSON.stringify(req.body, null, 2);
  try {
    let rawData = fs.readFileSync("./server/config.json");
    let parseData = JSON.parse(rawData);
    let newPath = "./schemas/Schema-" + req.params.schema + ".json";
    let data = { name: req.params.schema, path: newPath };
    parseData.schemas.push(data);
    fs.writeFileSync(
      "./schemas/Schema-" + req.params.schema + ".json",
      text,
      "utf8"
    );
    fs.writeFileSync(
      "./server/config.json",
      JSON.stringify(parseData, null, 2),
      "utf8"
    );
    res.status(201).send();
  } catch {
    res.status(401).send();
  }
});

app.get("/schemas/remove/:schema", function (req, res) {
  try {
    console.log("Entered server!");
    fs.readFileSync("./schemas/" + req.params.schema);
    let rawData = fs.readFileSync("./server/config.json");
    let parseData = JSON.parse(rawData);
    let filtered = parseData.schemas.filter(
      (s) => s.path != "./schemas/" + req.params.schema
    );
    parseData.schemas = filtered;
    fs.writeFileSync(
      "./server/config.json",
      JSON.stringify(parseData, null, 2),
      "utf8"
    );
    fs.unlinkSync("./schemas/" + req.params.schema);
    res.status(200).send();
  } catch {
    res.status(401).send();
  }
});

app.get("/schemas/file/:name", function (req, res) {
  let data = fs.readFileSync("./schemas/" + req.params.name);
  let schema = JSON.parse(data);

  if (schema !== undefined) {
    res.status(201).send(schema);
  } else {
    res.status(404);
  }
});

app.get("/schemas/fileExemplo", function (req, res) {
  let data = fs.readFileSync("./json-exemplo.json");
  let schema = JSON.parse(data);

  if (schema !== undefined) {
    res.status(201).send(schema);
  } else {
    res.status(404).send();
  }
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
