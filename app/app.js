var FB = require('fb'),
  async = require('async'),
  config = require('../config/config');

exports.fb = function(obj) {

  var postsLimit = obj.postsLimit || 100,
    responseLimit = obj.responseLimit || -1;

  return {
    me: function(callback) {

      FB.api('me', {
        fields: ['id', 'name', 'gender', 'posts.limit(' + postsLimit + '){picture,description,object_id,updated_time,type}']
      }, function(res) {

        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          callback(res, true);
        }

        var id = res.id,
          name = res.name,
          gender = res.gender,
          posts = [],
          postData = res.posts.data,
          resCount = 0;

        // object_idがある投稿のみ
        postData = postData.filter(function(x) {
          return typeof x.object_id !== 'undefined' && x.type !== 'video';
        });

        // data整形
        async.map(postData, function(x, cb) {

          FB.api('/' + x.object_id, {
            fields: ['images']
          }, function(res) {

            var image = [],
              text = '';

            resCount++;

            if (resCount >= postData.length || resCount > responseLimit) {
              // 規定の件数を超えていたら中断。この後のmap callbackは全部なかったことに
              return cb(true);
            }

            if (typeof res.images !== 'undefined' && res.images.length > 0) {
              image = filterImageData(res.images);
            }

            if (typeof x.description !== 'undefined') {
              text = x.description;
            }

            if (typeof image[0] !== 'undefined') {
              return cb(null, {
                image: image[0].source,
                text: text
              });
            }

            // 対応してないものはundef
            return cb(null);

          });
        }, function(err, results) {
          // ここでundefを除外
          results = results.filter(function(x) {
            return x;
          });
          callback(createCallbackObj(id, name, gender, results), false);
        });
      });
    }
  };
}

var filterImageData = function(images) {

  var image;
  if (images.length > 0) {
    image = images.filter(function(x) {
      return (x.height < 850 && x.height > 500);
    });
  }

  return image;
}

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
