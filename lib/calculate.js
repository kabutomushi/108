var async = require('async'),
    classifiers = require('./category.js');

module.exports = function(record, callback) {
  async.reduce(record.parsed.image, 0, function(sum, img, cb) {
    // 各タグについて
    async.forEachOf(classifiers, function(point, classifier, next) {
      // 各classifierにマッチするか
      if(img.classifier_id.indexOf(classifier) !== -1) {
        //したらすぐ抜ける
        cb(null, point);
        return next(true);
      }
      next();
    }, function(err) {
      if (!err) {
        // errの場合はすでにcb済み
        cb(null, 0);
      }
    });
  }, function(err, result) {
    // reduceしたものがresultに。textと合わせて返す
    var score = result + record.parsed.text * 5;
    callback(null, score);
  });
};
