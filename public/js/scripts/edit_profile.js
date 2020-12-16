jQuery(function ($) {
    let myForm = document.getElementById('edit-profile-form');
    let inputFirstName = document.getElementById('first-name-input');
    let inputLastname = document.getElementById('last-name-input');
    let inputDescription = document.getElementById('description-input');
    let errorDiv = document.getElementById('edit-profile-error');
    let errorUl = document.getElementById('edit-profile-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();
            
            errorDiv.hidden = true;

            while (errorUl.firstChild) {
                errorUl.removeChild(errorUl.firstChild);
            }

            let firstName = inputFirstName.value.trim();
            let lastName = inputLastname.value.trim();
            let description = inputDescription.value.trim();
            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!firstName) {
                hasErrors = true;
                errors.push('No first name was entered.');
                resetFields.push('first-name-input');
            }

            if (!lastName) {
                hasErrors = true;
                errors.push('No last name was entered.');
                resetFields.push('last-name-input');
            }

            if (!description) {
                hasErrors = true;
                errors.push('No description was entered.');
                resetFields.push('description-input');
            }

            if (hasErrors) {
                errorDiv.hidden = false;
                errors.forEach( (element) => {
                    let li = document.createElement('li');
                    li.innerHTML = element;
                    errorUl.appendChild(li);
                });
                
                if (resetFields.length > 0) {
                    resetFields.forEach( (element) => {
                        document.getElementById(element).value = '';
                    });

                    document.getElementById(resetFields[0]).focus();
                }
            } else {
                var profileConfig = {
                    method: 'POST', 
                    url: '/api/edit_profile',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'first-name': firstName,
                        'last-name': lastName,
                        'description': description
                    })
                };

                $.ajax(profileConfig)
                    .done(() => {
                        window.location.href = '/user';
                    })
                    .fail((e) => {
                        console.log(e);
                        alert('Could not edit profile');
                    });
            }
        });
    }
});