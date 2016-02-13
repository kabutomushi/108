var express = require('express'),
  router = express.Router(),
  config = require('../config/config');

router.get('/', function(req, res, next) {

  res.redirect("https://www.facebook.com/dialog/oauth?client_id="
  + config.facebook.appId
  + "&redirect_uri=http://tk2-244-31758.vs.sakura.ne.jp:3000/redirect"
  + "&scope=");

});

module.exports = router;
