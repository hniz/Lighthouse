jQuery(function ($) {
    let myForm = document.getElementById('register-form');
    let userEmail = document.getElementById('register-email');
    let userPassword = document.getElementById('register-password');
    let userFirstName = document.getElementById('register-first');
    let userLastName = document.getElementById('register-last');
    let registerType = document.getElementById('register-type');
    let errorDiv = document.getElementById('register-error');
    let errorUL = document.getElementById('register-error-list');

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
            let firstName = userFirstName.value.trim();
            let lastName = userLastName.value.trim();
            let type = registerType.value;
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!email) {
                hasErrors = true;
                errors.push('No email was entered.');
                resetFields.push('register-email');
            } else if (!validateEmail(email)) {
                hasErrors = true;
                errors.push('Invalid email.');
                resetFields.push('register-email');
            }

            if (!password) {
                hasErrors = true;
                errors.push('No password was entered.');
                resetFields.push('register-password');
            } else if (password.length < 6 || password.length > 30) {
                hasErrors = true;
                errors.push('Passwords must be 6-30 characters long.');
                resetFields.push('register-password');
            }

            if (!firstName) {
                hasErrors = true;
                errors.push('No first name was entered.');
                resetFields.push('register-first');
            }

            if (!lastName) {
                hasErrors = true;
                errors.push('No last name was entered.');
                resetFields.push('register-last');
            }

            if (type === 'SELECT') {
                hasErrors = true;
                errors.push('Please select the type of account.');
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
                    url: '/register',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'register-email': email,
                        'register-password': password,
                        'register-first': firstName,
                        'register-last': lastName,
                        'register-type': type,
                    }),
                    success: function() {
                        window.location.href = 'http://localhost:3000/login';
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