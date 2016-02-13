var FB = require('fb'),
  config = require('../config/config');
FB.setAccessToken(config.facebook.accessToken);

var express = require('express'),
  router = express.Router();

router.get('/', function(req, res, next) {

  console.log(req.query.access_token);

  if (typeof req.query.access_token !== 'undefined') {
    FB.setAccessToken();
  }

  res.send('success');
});

module.exports = router;
