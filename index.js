//var app = require('./app/app.js');

var express = require('express'),
  app = express(),
  oauth = require('./routes/oauth'),
  redirect = require('./routes/redirect');

app.use('/oauth', oauth);
app.use('/redirect', redirect);

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
