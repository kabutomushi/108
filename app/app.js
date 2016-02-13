var FB = require('fb');

FB.setAccessToken('');

exports.fb = function() {

  return {
    me: function(callback) {
      FB.api('me', {
        fields: ['id', 'name', 'gender', 'posts.limit(200){picture,description,object_id,updated_time}']
      }, function(res) {

        var err = false;
        if (!res || res.error) {
          console.log(!res ? 'error occurred' : res.error);
          err = true;
          callback(res, err);
        }

        var id = res.id,
          name = res.name,
          gender = res.gender,
          posts = [],
          postData = res.posts.data;

        callback({
          id: res.id,
          name: res.name,
          gender: res.gender,
          postData: res.posts.data
        });
      });
    },
    formatPostData: function(postData, callback) {

      var err = false;

      if (postData.length > 0) {

        // object_idがある投稿のみ
        postData = postData.filter(function(x) {
          return typeof x.object_id !== 'undefined';
        });

        // data整形
        postData.map(function(x) {

          FB.api('/' + x.object_id, {
            fields: ['images']
          }, function(res) {

            var image, text = '';

            image = filterImageData(res.images);

            if (typeof x.description !== 'undefined') {
              text = x.description;
            }

            if (typeof image[0] === 'undefined') {
              image[0] = {
                source: ''
              };
            }

            callback({
              image: image[0].source,
              text: text
            });

          });
        });

      }
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
