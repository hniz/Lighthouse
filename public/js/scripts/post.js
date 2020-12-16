(function ($) {
    $('.comment-form').on('submit', (commentevent) => {
        commentevent.preventDefault();
        const children = commentevent.target.children;
        const comment = children.namedItem('comment-content').value;
        const parentid = children.namedItem('parent-id').value;
        let errorDiv = document.getElementById('comment-error');
        let errorUL = document.getElementById('comment-error-list');
        let hasErrors = false;
        let errors = [];
        let resetFields = [];
        
        errorDiv.hidden = true;

        while (errorUL.firstChild) {
            errorUL.removeChild(errorUL.firstChild);
        }
        
        if (!comment) {
            hasErrors = true;
            errors.push('No comment body was entered.');
            resetFields.push('comment-content');
        }

        if (!parentid) {
            hasErrors = true;
            errors.push('No parent id given.');
        }

        if (hasErrors) {
            errorDiv.hidden = false;
            errors.forEach( (element) => {
                let li = document.createElement('li');
                li.innerHTML = element;
                errorUL.appendChild(li);
            });

            if (resetFields.length > 0) {
                resetFields.forEach( (element) => {
                    document.getElementById(element).value = '';
                });
                document.getElementById(resetFields[0]).focus();
            }
        } else {
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
        }
    });
})(window.jQuery);
