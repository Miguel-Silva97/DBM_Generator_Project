var express = require("express");
var app = express();
var generate = require("./server/server");

app.use(express.static("public")); //definição de uma pasta 'public' como estática

app.get("/index.htm", function (req, res) {
  res.sendFile(__dirname + "/" + "index.htm"); //esta seria a página com oformulário
});

app.post("/generate", function (req, res) {
  generate();
});

var server = app.listen(8081, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Example app listening at http://%s:%s", host, port);
});
