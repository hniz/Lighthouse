jQuery(function ($) {
    let myForm = document.getElementById('login-form');
    let userEmail = document.getElementById('login-email');
    let userPassword = document.getElementById('login-password');
    let errorDiv = document.getElementById('login-error');
    let errorUL = document.getElementById('login-error-list');
    let redirect = document.getElementById('redirect-url');

    function validateEmail(email) {
        let emailRegex = /\S+@\S+\.\S+/;
        return emailRegex.test(email);
    }

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let email = userEmail.value.trim();
            let password = userPassword.value;
            let hasErrors = false;
            let errors = [];

            if (!email) {
                hasErrors = true;
                errors.push('No email was entered.');
            } else if (!validateEmail(email)) {
                hasErrors = true;
                errors.push('Invalid email.');
            }

            if (!password) {
                hasErrors = true;
                errors.push('No password was entered.');
            }

            if (hasErrors) {
                errorDiv.hidden = false;
                errors.forEach((element) => {
                    let li = document.createElement('li');
                    li.innerHTML = element;
                    errorUL.appendChild(li);
                });

                myForm.reset();
                userEmail.focus();
            } else {
                var requestConfig = {
                    method: 'POST',
                    url: '/login', // this is what is wrong, it only posts to /login/ but that redirects to /login with a get not a post
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'login-email': email,
                        'login-password': password,
                    }),
                    success: function () {
                        window.location.href = redirect.value || '/dashboard';
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
