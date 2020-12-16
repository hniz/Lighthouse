jQuery(function ($) {
    let myForm = document.getElementById('edit-class-form');
    let inputClassName = document.getElementById('class-name');
    let inputClassDescription = document.getElementById('class-description');
    let inputClassCode = document.getElementById('class-code');
    let inputClassPassword = document.getElementById('class-password');
    let inputClassId = document.getElementById('class-id');
    let errorDiv = document.getElementById('edit-class-error');
    let errorUL = document.getElementById('edit-class-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let className = inputClassName.value.trim();
            let classDescription = inputClassDescription.value.trim();
            let classCode = inputClassCode.value.trim();
            let classPassword = inputClassPassword.value;
            let classId = inputClassId.value;
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!className) {
                hasErrors = true;
                errors.push('No class name was entered.');
                resetFields.push('class-name');
            }

            if (!classDescription) {
                hasErrors = true;
                errors.push('No class description was entered.');
                resetFields.push('class-description');
            }

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

            if (!classId) {
                hasErrors = true;
                errors.push('No class id was entered.');
                resetFields.push('class-id');
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
                const editClassConfig = {
                    method: 'POST',
                    url: '/class/edit',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'class-name': className,
                        'class-description': classDescription,
                        'class-code': classCode,
                        'class-password': classPassword,
                        'class-id': classId,
                    }),
                };

                $.ajax(editClassConfig)
                    .done(() => {
                        window.location.href = `/class/${classId}`;
                    })
                    .fail((e) => {
                        console.log(e);
                        alert(`Could not edit the class ${className}`);
                    });
            }
        });
    }
});