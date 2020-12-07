(function ($) {
    var classPosts = $('.post-list');
    var classList = $('.class-list');
    var classes = classList.find('li').on('click', function (event) {
        const classid = event.target.id;
        var requestConfig = {
            method: 'GET',
            url: 'api/getClassPosts',
            contentType: 'application/json',
            data: { id: classid },
        };
        $.ajax(requestConfig).then((responseMessage) => {
            classPosts.html($(responseMessage));
        });
    });
})(window.jQuery);
