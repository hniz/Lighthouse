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
            
            while(errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let classCode = inputClassCode.value;
            let classPassword = inputClassPassword.value;
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!classCode) {
                hasErrors = true;
                errors.push('No class code was entered.');
                resetFields.push('class-code');
            }
            
            if (!classPassword) {
                hasErrors = true;
                errors.push('No class password was entered.');
                resetFields.push('class-password');
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
                    url: '/class/join',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'class-code': classCode,
                        'class-password': classPassword,
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