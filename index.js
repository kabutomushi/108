var app = require('./app/app.js');

app.fb().me(function(res, err) {

  if (!err) {

    var id = res.id,
      name = res.name,
      gender = res.gender,
      posts = [],
      postData = res.postData;

    app.fb().formatPostData(postData, function(res, end, err) {

      if (!err) {

        posts.push(res);

        if (end) {
          var results = createCallbackObj(id, name, gender, posts);
          console.log(results);
        }

      } else {
        console.log('err at formatPostData');
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
