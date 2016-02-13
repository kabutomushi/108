var FB = require('fb'),
  config = require('../config/config');
FB.setAccessToken(config.facebook.accessToken);

var express = require('express'),
  router = express.Router();

router.get('/', function(req, res, next) {

  console.log(req.query.access_token);

  if (typeof req.query.code !== 'undefined') {

    var code = req.quert.code,
      url = 'https://graph.facebook.com/v2.3/oauth/access_token?'
      + 'client_id='
      + config.facebook.appId
      + '&redirect_uri=http://tk2-244-31758.vs.sakura.ne.jp:3000/redirect'
      + '&client_secret=' + config.facebook.appSecret
      + '&code=' + code;

      res.redirect(url);

  } else if (typeof req.query.access_token !== 'undefined') {

    FB.setAccessToken(req.query.access_token);

    console.log(req.query.access_token);

    res.send('success');
  } else {
    // error
  }
});

module.exports = router;
