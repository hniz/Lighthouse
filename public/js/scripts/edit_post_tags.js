jQuery(function ($) {
    let myForm = document.getElementById('edit-post-tag-form');
    let inputTagInput = document.getElementById('tag-input');
    let inputPostTagID = document.getElementById('post-id-tag');
    let errorDiv = document.getElementById('edit-post-tag-error');
    let errorUL = document.getElementById('edit-post-tag-error-list');

    if (myForm) {
        myForm.addEventListener('submit', (event) => {
            event.preventDefault();

            errorDiv.hidden = true;

            while (errorUL.firstChild) {
                errorUL.removeChild(errorUL.firstChild);
            }

            let tagInput = inputTagInput.value.trim();
            let postTagID = inputPostTagID.value;
            let postTag = $('tag-input').find(':selected').text();

            let hasErrors = false;
            let errors = [];
            let resetFields = [];

            // if (!tagInput) {
            //     hasErrors = true;
            //     errors.push('No tags were entered.');
            //     resetFields.push('tag-input');
            // }
            
            if (!postTagID) {
                hasErrors = true;
                errors.push('No post ID was entered.');
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
                console.log(postTag);
                var tagConfig = {
                    method: 'POST',
                    url: '/post/edit/tags',
                    contentType: 'application/json',
                    data: JSON.stringify({
                        'tag-name': tagInput,
                        'post-id': postTagID,
                        'post-tag': postTag,
                    }),
                };

                $.ajax(tagConfig)
                    .done(() => {
                        window.location.href = `/post/edit/${postTagID}`;
                    })
                    .fail((e) => {
                        console.log(e);
                        alert('Could not edit the class tags');
                    });
            }
        });
    }
});