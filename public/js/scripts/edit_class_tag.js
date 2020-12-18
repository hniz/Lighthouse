jQuery(function ($) {
    let myForm = document.getElementById('edit-class-tag-form');
    let inputTagInput = document.getElementById('tag-input');
    let inputClassTagID = document.getElementById('class-id-tag');
    let errorDiv = document.getElementById('edit-class-tag-error');
    let errorUL = document.getElementById('edit-class-tag-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let tagInput = inputTagInput.value.trim();
            tagInput = tagInput.replace(/_/g, ' ');
            let classTagID = inputClassTagID.value;

            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            if (!tagInput) {
                hasErrors = true;
                errors.push('No tags were entered.');
                resetFields.push('tag-input');
            }
            
            if (!classTagID) {
                hasErrors = true;
                errors.push('No class ID was entered.');
            }

            if (hasErrors) {
                errorDiv.hidden = false;
                errors.forEach((element) => {
                    let li = document.createElement('li');
                    li.innerHTML = element;
                    errorUL.appendChild(li);
                });

                if (resetFields.length > 0) {
                    resetFields.forEach((element) => {
                        document.getElementById(element).value = '';
                    });
                    document.getElementById(resetFields[0]).focus();
                }
            } else {
                var tagConfig = {
                    method: 'POST',
                    url: '/class/edit/tags',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'tag-name': tagInput,
                        'class-id': classTagID,
                    }),
                };

                $.ajax(tagConfig)
                    .done(() => {
                        window.location.href = `/class/${classTagID}`;
                    })
                    .fail((e) => {
                        console.log(e);
                        alert('Could not edit the class tags');
                    });
            }
        });
    }
});