var app = require('./app/app.js');

app.fb({
  postsLimit: 200,
  responseLimit: 10
}).me(function(res, err) {
  if (!err) {
    console.log(res);
  }
});
