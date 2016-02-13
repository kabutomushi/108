var async = require('async'),
    request = new require('request'),
    fs = require('fs'),
    getTextScore = require('./text'),
    classifiers = require('./category.js'),
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
      getTextScore(post.text, function(err, textScore) {
        post.parsed = {
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
    calculateScore(results, function() {
      delete results.parsed;
      callback(err, results);
    })
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

function calculateScore(record, callback) {
  async.reduce(record.parsed.image, 0, function(sum, img, cb) {
    // 各タグについて
    async.forEachOf(classifiers, function(point, classifier, next) {
      // 各classifierにマッチするか
      if(img.indexOf(classifier)) {
        //したらすぐ抜ける
        cb(null, point);
        next(true);
      }
      next();
    }, function() {
      cb(null, 0);
    });
  }, function(err, result) {
    // reduceしたものがresultに。textと合わせて返す
    record.score = result + record.parsed.text * 5;
    callback();
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
