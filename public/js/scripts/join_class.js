jQuery(function ($) {
    let myForm = document.getElementById('join-class-form');
    let inputClassCode = document.getElementById('class-code');
    let inputClassPassword = document.getElementById('class-password');
    let errorDiv = document.getElementById('join-class-error');
    let errorUL = document.getElementById('join-class-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let classCode = inputClassCode.value.trim();
            let classPassword = inputClassPassword.value.trim();
            let hasErrors = false;
            let errors = [];

            if (!classCode) {
                hasErrors = true;
                errors.push('No class code was entered.');
            }

            if (!classPassword) {
                hasErrors = true;
                errors.push('No class password was entered.');
            }

            if (hasErrors) {
                errorDiv.hidden = false;
                errors.forEach((element) => {
                    let li = document.createElement('li');
                    li.innerHTML = element;
                    errorUL.appendChild(li);
                });
            } else {
                var requestConfig = {
                    method: 'POST',
                    url: '/api/joinClass',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'class-code': classCode,
                        'class-password': classPassword,
                    }),
                    success: function () {
                        window.location.href =
                            'http://localhost:3000/dashboard';
                    },
                    error: function (jqXHR, exception) {
                        var msg = '';
                        if (jqXHR.status === 0) {
                            msg = 'Not connect.\n Verify Network.';
                        } else if (jqXHR.status == 404) {
                            errorDiv.hidden = false;
                            errorUL.innerHTML =
                                '<li>Invalid Class Code/Password.</li>';
                            msg = 'Requested page not found. [404]';
                        } else if (jqXHR.status == 500) {
                            errorDiv.hidden = false;
                            errorUL.innerHTML =
                                '<li>Internal server error.</li>';
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
