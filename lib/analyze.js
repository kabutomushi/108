var async = require('async'),
    request = new require('request'),
    fs = require('fs'),
    calcScore = require('./score'),
    temp = require('temp').track(),
    stream = require('stream'),
    watson = require('watson-developer-cloud'),
    config = require('../config/config'),
    Vr = watson.visual_recognition;

var vr = new Vr(config.watson.credentials),
    results;

/*
 * args: { attrs:{gender, ...}, posts: [ {image: "http://", text: "text"}, ... ] }
 */
function getImageTags(args, callback) {
  async.each(args.posts, function(post, postCb) {
    results = [];
    async.waterfall([
    function(cb) {
      fetchImage(post, function(err, filename) {
        cb(err, filename);
      });
    },
    function(filename, cb) {
      // 画像をwatsonに投げつける
      var params = {
        images_file: fs.createReadStream(filename)
      };
      vr.classify(params, function(err, info) {
        if (err) {
          console.log(err);
          // bye error
          return cb();
        } else {
          console.log("finished a job")
          return cb(null, info.images[0].scores);
        }
      });
    },
    function(score, cb) {
      calcScore(post.text, function(err, textScore) {
        post.scores = {
          text: textScore,
          image: score
        };
        results.push(post);
        cb();
      });
    }
    ], function(err) { //end of waterfall
      postCb();
    });
  } , function(err) { // end of each
    callback(err, results);
  });
}

function fetchImage(post, cb) {
  var options = {
    uri: post.image,
    encoding: null,
  }

  request(options, function(err, res, body) {
    var filename,
        data = [];

    if (err || res.statusCode !== 200) {
      console.log('Failed to fetch image (not 200)')
      console.log(err);
      return cb(true);
    }

    console.log("fetching image: " + post.image);
    filename = temp.open({
      suffix: getExtensionFromUrl(post.image),
      prefix: 'temp108_'
    }, function(err, info) {
      if (!err) {
        fs.write(info.fd, body, 0, body.length, function(err) {
          fs.close(info.fd, function(err) {
            cb(null, info.path);
          });
        });
      } else {
        console.log('Failed to create tempfile');
        cb(true);
      }
    });

  });
}


function getExtensionFromUrl(url) {
  var matches = url.match(/http.*(\.[a-z]{3})\?*/);
  if (matches) {
    console.log("extension", matches[1]);
    return matches[1];
  }
  console.log("guess: .jpg");
  return 'jpg'
}

module.exports = getImageTags;


// 使わなくなった人たち


// argsのimages配列をもらうと画像を並列に取りに行って
// 保存してそのファイル名を各objectに追加して返す
function fetchImages(posts, callback) {
  async.map(posts, function(post, cb) {
    http.get(post.image, function(res) {
      var filename;

      if (res.statusCode !== 200) {
        console.log('Failed to fetch image (not 200)')
        return cb();
      }

      filename = temp.open('temp108_', function(err, info) {
        if (!err) {
          fs.write(info.fd, res);
          fs.close(info.fd, function(err) {
            // 元のデータにfilenameを追加
            post.filename = info.path;
            cb(null, post);
          });
        } else {
          console.log('Failed to create tempfile');
          cb();
        }
      });

    }).on('error', function(e) {
      console.log('Failed to fetch image');
      console.log(e);
      return cb();
    });
  }, function(err, results) {
    console.log("data");
    console.log(results);
    callback(null, results);
  })
}