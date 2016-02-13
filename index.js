//var app = require('./app/app.js');

var express = require('express')
var app = express()

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/oauth', function(req, res) {
  res.send('oauth endpoint');
});

app.listen(3000)

/*
app.fb({
  postsLimit: 200,
  responseLimit: 10
}).me(function(res, err) {
  if (!err) {
    console.log(res);
  }
});
*/
