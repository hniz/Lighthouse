jQuery(function ($) {
    let myForm = document.getElementById('new-class-form');
    let inputClassName = document.getElementById('class-name');
    let inputClassDescription = document.getElementById('class-description');
    let errorDiv = document.getElementById('new-class-error');
    let errorUL = document.getElementById('new-class-list-error');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while(errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let className = inputClassName.value.trim();
            let classDescription = inputClassDescription.value.trim();
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!className) {
                hasErrors = true;
                errors.push('No name for the class was entered.');
                resetFields.push('class-name');
            }

            if (!classDescription) {
                hasErrors = true;
                errors.push('No description for the class was entered.');
                resetFields.push('class-description');
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
                const classConfig = {
                    method: 'POST',
                    url: '/class/new',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'class-name': className,
                        'class-description': classDescription
                    })
                };

                $.ajax(classConfig)
                    .done( () => {
                        window.location.href = 'http://localhost:3000/dashboard';
                    })
                    .fail( (e) => {
                        console.log(e);
                        alert(`Could not create a class for ${className}`);
                    })
            }
        })
    }
});