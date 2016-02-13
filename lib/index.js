var analyze = require('./analyze');

analyze({
  attrs: {
    gender: 1
  },
  posts: [
    {
        image: "http://www.papalagi.co.jp/mediagallery/mediaobjects/disp/f/f__31_.jpg",
      text: "test"
    },
  ]
}, function(err, results) {
  results.forEach(function(result) {
    console.log(require('util').inspect(result, {depth: null}));
  })
});
