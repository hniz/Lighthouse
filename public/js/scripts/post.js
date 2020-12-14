(function ($) {
    $('.comment-form').on('submit', (commentevent) => {
        commentevent.preventDefault();
        commentevent.preventDefault();
        const children = commentevent.target.children;
        const comment = children.namedItem('comment-content').value;
        const parentid = children.namedItem('parent-id').value;
        const commentConfig = {
            method: 'POST',
            url: '/api/comment',
            contentType: 'application/json',
            data: JSON.stringify({
                'comment-content': comment,
                'parent-id': parentid,
            }),
        };
        $.ajax(commentConfig)
            .done(() => {
                location.reload();
            })
            .fail((e) => {
                console.log(e);
                alert('Comment failed to post');
            });
    });
})(window.jQuery);
