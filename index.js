var app = require('./app/app.js');

app.fb().me(function(res, err) {

  if (!err) {

    var id = res.id,
      name = res.name,
      gender = res.gender,
      posts = [],
      postData = res.postData;

    app.fb().formatPostData(postData, function(res, err) {

      if (!err) {

        posts.push(res);

        if (posts.length === 10) {
          var results = createCallbackObj(id, name, gender, posts);
          console.log(results);
        }

      }

    });
  }
});

var createCallbackObj = function(id, name, gender, posts) {
  return {
    attrs: {
      id: id,
      name: name,
      gender: gender
    },
    posts: posts
  }
}
