jQuery(function ($) {
    const deletePostButton = $('.delete-post');
    let inputPostID = document.getElementById('post-id');
    deletePostButton.on('click', (event) => {
        event.preventDefault();

        let postID = inputPostID.value.trim();
        let errors = [];
        let hasErrors= false;
        let resetFields = [];

        if(!postID){
            hasErrors = true;
            errors.push('No post ID was entered.');
            resetFields.push('post-id');
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
                url: '/api/deletePost',
                contentType: 'application/json',
                data: JSON.stringify({
                    'post-id': postID,
                }),

            };

            $.ajax(requestConfig)
                .done(() => {
                    window.location.href = '/dashboard';
                })
                .fail((e) => {
                    console.log(e);
                    alert('Post failed to delete');
                });

        }
    });
});