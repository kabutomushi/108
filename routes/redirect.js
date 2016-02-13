var FB = require('fb'),
  appFb = require('../app/app').fb,
  config = require('../config/config'),
  request = require('request'),
  analyze = require('../lib/analyze');

var express = require('express'),
  router = express.Router();

router.get('/', function(req, res, next) {

  console.log(req.query.access_token);

  if (typeof req.query.code !== 'undefined') {

    var code = req.query.code,
      url = 'https://graph.facebook.com/v2.3/oauth/access_token?'
      + 'client_id='
      + config.facebook.appId
      + '&redirect_uri=http://tk2-244-31758.vs.sakura.ne.jp:3000/redirect'
      + '&client_secret=' + config.facebook.appSecret
      + '&code=' + code;

      var options = {
        url: url
      };

      request.get(options, function(error, response, body) {
        var json = JSON.parse(body);

        FB.setAccessToken(json.access_token);

        fetchPostsAndAnalyze(); // async

        res.send('success');
      });
  }
});


function fetchPostsAndAnalyze() {
  appFb({
    postsLimit: 100,
    responseLimit: 10
  }).me(function(res, err) {
    if (!err) {
      console.log(res);
      analyze(res, function(err, results) {
        console.log(res);
        //TODO: ここでredis に set + notify
      });
    }
  });
}

module.exports = router;
