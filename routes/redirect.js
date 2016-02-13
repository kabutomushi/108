var FB = require('fb'),
  appFb = require('../app/app').fb,
  config = require('../config/config'),
  redis = require('redis'),
  request = require('request'),
  util = require('util'),
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
      analyze(res, function(err, results) {
        // for debugging
        console.log(util.inspect(results, {showHidden: false, depth: null}));

        var id = Math.floor(Math.random() * 1000000);
        var client = redis.createClient({
          host: config.server.hostname
        });
        client.set('bnData', JSON.stringify({
          id: id,
          data: results
        }), function(err) {
          if (err) {
            console.log("Failed to set bnData for " + id, err);
          }
        });
        client.publish('bnNotify', id, function(err) {
          if (err) {
            console.log("Failed to publish bnNotify for " + id);
          }
        });

        /* make the API call */
        FB.api(
          "/me/feed",
          "POST",
          {
            "message": "This is a test message",
            "link": results[0].id
          },
          function (response) {
            if (response && !response.error) {
              /* handle the result */
            }
          }
          );
      });
    }
  });
}

module.exports = router;
