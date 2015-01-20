var express = require('express');
var fs = require('fs');
var app = express();

app.listen(3000);

app.get('/', function(req, res){
  res.status(200).sendFile('/client/index.html', {"root": "/Users/mikemoss/Dev/hackreactor/mvp/"});
});