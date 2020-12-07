(function ($) {
    console.log("yeet");
    var classPosts = $('.post-list');
    var classList = $('.class-list');
    var classes = classList.find('li').on('click', function (event){
        console.log(event);
        const classid = event.target.id;
        var requestConfig = {
            method: 'GET',
            url: 'api/getClassPosts',
            contentType: 'application/json',
            data: {id: classid},
            dataType : 'json',
          };
        console.log(requestConfig);
        
          $.ajax(requestConfig).then(function (responseMessage){
              classPosts.replace($(responseMessage));
              console.log(responseMessage);
          });

    });


})(window.jQuery);