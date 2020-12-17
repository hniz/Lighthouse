(function ($) {
    const commentForms = $('.comment-form');
    commentForms.on('submit', function (commentevent) {
        commentevent.preventDefault();
        const id = commentevent.target.id.split('-')[1];
        const children = commentevent.target.children;
        const comment = children.namedItem(`comment-content-${id}`).value.trim();
        const parentid = children.namedItem(`parent-id-${id}`).value;

        const parentPostLI = commentevent.target.parentElement;
        const currentTarget = parentPostLI.children;

        let hasErrors = false;
        let errors = [];
        let hasErrorDiv = false;
        let i = 0;
        let formIndex = 0;
        let errorDivIndex = 0;
        for (i = 0; i < currentTarget.length; i++) {
            if (currentTarget[i].className === 'dashboard-comment-error-div') {
                hasErrorDiv = true;
                errorDivIndex = i;
            }

            if (currentTarget[i].className === 'comment-form') {
                formIndex = i;
            }
        }

        let errorDiv;
        let errorUL;

        if (hasErrorDiv) {
            errorDiv = currentTarget[errorDivIndex];
            errorUL = errorDiv.firstChild;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }
        } else {
            errorDiv = document.createElement('div');
            errorDiv.className = 'dashboard-comment-error-div';

            errorUL = document.createElement('ul');
            errorUL.className = 'dashboard-comment-error-list';
        }

        errorDiv.hidden = true;

        if (!comment) {
            hasErrors = true;
            errors.push('No comment body was entered.');
        }

        if (!parentid) {
            hasErrors = true;
            errors.push('No parent id given.');
        }

        if (hasErrors) {
            errorDiv.hidden = false;
            errors.forEach((element) => {
                let li = document.createElement('li');
                li.innerHTML = element;
                errorUL.appendChild(li);
            });

            if (!hasErrorDiv) {
                errorDiv.appendChild(errorUL);
                currentTarget[formIndex].insertAdjacentElement('afterend', errorDiv);
            }

            children.namedItem(`comment-content-${id}`).value = '';
            children.namedItem(`comment-content-${id}`).focus();
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
                    $(`#${commentevent.target.id}`)[0].reset();
                    location.reload();
                })
                .fail(() => {
                    alert('Comment failed to post');
                });
        }
    });
})(window.jQuery);
