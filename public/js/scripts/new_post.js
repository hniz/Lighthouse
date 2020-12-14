jQuery(function ($) {
    let myForm = document.getElementById('new-post-form');
    let inputPostName = document.getElementById('post-name');
    let inputPostDescription = document.getElementById('post-description');
    let inputPostClassID = document.getElementById('post-class');
    let errorDiv = document.getElementById('new-post-error');
    let errorUL = document.getElementById('new-post-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let postName = inputPostName.value.trim();
            let postDescription = inputPostDescription.value.trim();
            let postClassID = inputPostClassID.value.trim();
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!postName) {
                hasErrors = true;
                errors.push('No name for the post was entered.');
                resetFields.push('post-name');
            }

            if (!postDescription) {
                hasErrors = true;
                errors.push('No description for the post was entered.');
                resetFields.push('post-description');
            }

            if (!postClassID) {
                hasErrors = true;
                errors.push('No class is associated with the post.');
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
                    url: '/post/new',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'post-class': postClassID,
                        'post-description': postDescription,
                        'post-name': postName,
                    }),
                    success: function() {
                        window.location.href = 'http://localhost:3000/dashboard'; // figure out where to redirect
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