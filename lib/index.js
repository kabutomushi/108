var analyze = require('./analyze');

analyze({
  attrs: {
    gender: 1
  },
  posts: [
    {
      image: "http://stamefusa.sakura.ne.jp/meat.jpg",
      text: "test"
    },
    {
      image: "http://stamefusa.sakura.ne.jp/beer.jpg",
      text: "test"
    },
    {
      image: "http://stamefusa.sakura.ne.jp/snow.jpg",
      text: "test"
    },
    {
      image: "http://stamefusa.sakura.ne.jp/party.jpg",
      text: "test"
    },
  ]
}, function(err, results) {
  results.forEach(function(result) {
    console.log(result);
  })
});