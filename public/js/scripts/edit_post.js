jQuery(function ($) {
    let myForm = document.getElementById('edit-post-form');
    let inputPostTitle = document.getElementById('post-title');
    let inputPostContent = document.getElementById('post-content');
    let inputPostID = document.getElementById('post-id');
    let errorDiv = document.getElementById('edit-post-error');
    let errorUL = document.getElementById('edit-post-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let postTitle = inputPostTitle.value.trim();
            let postContent = inputPostContent.value.trim();
            let postID = inputPostID.value.trim();
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!postTitle) {
                hasErrors = true;
                errors.push('No title for the post was entered.');
                resetFields.push('post-title');
            }

            if (!postContent) {
                hasErrors = true;
                errors.push('No content for the post was entered.');
                resetFields.push('post-content');
            }

            if (!postID) {
                hasErrors = true;
                errors.push('No post ID was entered.');
                resetFields.push('post-id');
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
                var requestConfig = {
                    method: 'POST',
                    url: '/post/edit',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'post-id': postID,
                        'post-title': postTitle,
                        'post-content': postContent
                    }),
                    success: function() {
                        window.location.href = 'http://localhost:3000/dashboard';
                    },
                    error: function (jqXHR, exception) {
                        var msg = '';
                        if (jqXHR.status === 0) {
                            msg = 'Not connect.\n Verify Network.';
                        } else if (jqXHR.status == 404) {
                            msg = 'Requested page not found. [404]';
                        } else if (jqXHR.status == 500) {
                            msg = 'Internal Server Error [500].';
                        } else if (exception === 'parsererror') {
                            msg = 'Requested JSON parse failed.';
                        } else if (exception === 'timeout') {
                            msg = 'Time out error.';
                        } else if (exception === 'abort') {
                            msg = 'Ajax request aborted.';
                        } else {
                            msg = 'Uncaught Error.\n' + jqXHR.responseText;
                        }
                        console.log(msg);
                    },
                };

                $.ajax(requestConfig);
            }
        });
    }
});