(function ($) {
    const endorseButton = $('.endorse-button');
    if (endorseButton.length !== 0) {
        endorseButton.on('click', (event) => {
            event.preventDefault();
            const postID = event.target.id.split('-')[1];
            const endorse = event.target.id.startsWith('endorse');
            var endorseConfig = {
                method: 'POST',
                url: `/api/endorse/${postID}?endorse=${endorse}`,
                contentType: 'application/json',
            };
            $.ajax(endorseConfig)
                .done(({ endorse, postId }) => {
                    event.target.id =
                        endorse === 'true'
                            ? `unendorse-${postId}`
                            : `endorse-${postId}`;
                    event.target.innerText =
                        endorse === 'true' ? 'Un-endorse Post' : 'Endorse Post';
                    console.log(event);
                    if (endorse === 'true') {
                        event.target.parentElement.parentElement.classList.add(
                            'post-endorse'
                        );
                    } else {
                        event.target.parentElement.parentElement.classList.remove(
                            'post-endorse'
                        );
                    }
                })
                .fail(() => {
                    alert('Failed to endorse/unendorse post.');
                });
        });
    }
})(window.jQuery);
