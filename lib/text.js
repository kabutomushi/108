var dictionary = require('./dictionary'),
    async = require('async');

function calculate(text, callback) {
  console.log("calcing");
  async.reduce(dictionary, 0, function(sum, keyword, cb) {
    if (text.indexOf(keyword) !== -1) {
      sum++;
    }
    cb(null, sum);
  }, function(err, result) {
    callback(err ,result);
  });
}


module.exports = calculate;