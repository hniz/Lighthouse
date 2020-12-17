jQuery(function ($) {
    let myForm = document.getElementById('delete-profile-form');
    let emailAddress = document.getElementById('email-input');
    let errorDiv = document.getElementById('delete-profile-error');
    let errorUl = document.getElementById('delete-profile-error-list');

    if(myForm){
        myForm.addEventListener('submit', (event) =>{
            event.preventDefault();
            errorDiv.hidden = true;

            while(errorUl.firstChild){
                errorUl.removeChild(errorUl.firstChild);
            }
            
            let email = emailAddress.value.trim();
            let errors = [];
            let hasErrors = false;
            let resetFields = [];

            if(!email){
                hasErrors = true;
                errors.push('No email address entered.'),
                resetFields.push('email-input');
            }
            
            if(hasErrors){
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
                    url: '/api/delete_profile',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'email': email,
                    }),
                };

                $.ajax(profileConfig)
                    .done(() => {
                        window.location.href = '/login';
                    })
                    .fail((e) => {
                        console.log(e);
                        alert('Could not delete student account.');
                    });
            }
       
        });
    }


});