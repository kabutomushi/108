//var app = require('./app/app.js');

var express = require('express'),
  app = express(),
  ok = require('./routes/ok'),
  oauth = require('./routes/oauth'),
  config = require('./config/config'),
  redirect = require('./routes/redirect'),
  redis = require('redis'),
  subscriber,
  redisClient;

app.use('/ok', ok);
app.use('/oauth', oauth);
app.use('/redirect', redirect);

redisClient = redis.createClient({
  host: config.server.hostname
});
subscriber = redis.createClient({
  host: config.server.hostname
});

// 起動時はqueueに残っている削除リストを元に全て削除
var redisLoop;
do {
  removeFromRedis(function(err, id) {
    if (err) {
      console.log("failed to connect to redis");
      console.log(err);
    }
    redisLoop = !err && id;
  });
} while(redisLoop);


subscriber.on('message', function(channel, message) {
  var id;

  if (channel !== 'bnComplete') {
    return;
  }

  // mac側の処理が完了したので
  // * bnDataのデータをdel
  // * そのidのデータをredisから消す
  redisClient.del('bnData', function(err) {
    if (err) {
      console.log('Failed to remove bnData', err);
    }
  });
  removeFromRedis(function(err) {
    if (err) {
      console.log('Failed to remove redis ids', err);
    }
  });

});

// mac側からの完了を待ち受ける
subscriber.subscribe('bnComplete');

app.listen(3000)


function removeFromRedis(callback) {
  var id = redisClient.rpop('bnDelete', function(err, id) {
    if (!err && id) {
      redisClient.del('id' + id, function(err) {
        callback(err, id);
      });
      return;
    }
    callback(err);
  });
}
