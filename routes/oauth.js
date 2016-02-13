var express = require('express'),
  router = express.Router();

router.get('/', function(req, res, next) {

/*
  var options = {
    url: 'https://graph.facebook.com/oauth/device',
    form: {
      type: 'device_code',
      client_id: '1526483817646843',
      scope: 'public_profile,user_likes'
    }
  };

  request.post(options, function(error, response, body) {
      console.log(response);
  });
  */

  res.redirect("https://www.facebook.com/dialog/oauth?client_id="
  + config.facebook.appId
  + "&redirect_uri=http://tk2-244-31758.vs.sakura.ne.jp:3000/redirect"
  + "&scope=");

  //res.send('oauth test');
});

module.exports = router;
