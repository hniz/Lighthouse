(function getClassPosts($) {
    var classPosts = $('.post-list');
    var classList = $('.class-list');
    classList.find('li').on('click', function (event) {
        const classid = event.target.id;
        var requestConfig = {
            method: 'GET',
            url: 'api/getClassPosts',
            contentType: 'application/json',
            data: { id: classid },
        };
        $.ajax(requestConfig).then((responseMessage) => {
            const posts = $(responseMessage);
            classPosts.html(posts);
            const commentForms = posts.find('.comment-form');
            commentForms.on('submit', function (commentevent) {
                commentevent.preventDefault();
                const children = commentevent.target.children;
                const comment = children.namedItem('comment-content').value;
                const parentid = children.namedItem('parent-id').value;
                const commentConfig = {
                    method: 'POST',
                    url: 'api/comment',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'comment-content': comment,
                        'parent-id': parentid,
                    }),
                };
                $.ajax(commentConfig)
                    .done(() => {
                        event.target.click();
                    })
                    .fail(() => {
                        // eslint-disable-next-line no-undef
                        alert('Comment failed to post');
                    });
            });
        });
    });
    // eslint-disable-next-line no-undef
})(window.jQuery);
