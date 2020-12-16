(function ($) {
    const endorseButton = $('.endorse-comment-button');
    if (endorseButton.length !== 0) {
        endorseButton.on('click', (event) => {
            event.preventDefault();
            const commentID = event.target.id.split('-')[1];
            const endorse = event.target.id.startsWith('endorse');
            var endorseConfig = {
                method: 'POST',
                url: `/api/endorseComment/${commentID}?endorse=${endorse}`,
                contentType: 'application/json',
            };
            $.ajax(endorseConfig)
                .done(({ endorse, commentId }) => {
                    event.target.id =
                        endorse === 'true'
                            ? `unendorse-${commentId}`
                            : `endorse-${commentId}`;
                    event.target.innerText =
                        endorse === 'true' ? 'Un-endorse' : 'Endorse';
                    if (endorse === 'true') {
                        event.target.parentElement.classList.add(
                            'comment-endorse'
                        );
                    } else {
                        event.target.parentElement.classList.remove(
                            'comment-endorse'
                        );
                    }
                })
                .fail(() => {
                    alert('Failed to endorse/unendorse comment.');
                });
        });
    }
})(window.jQuery);
