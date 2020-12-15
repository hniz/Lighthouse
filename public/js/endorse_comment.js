(function ($) {
    const endorseButton = $('.endorse-comment-button');
    if (endorseButton.length !== 0) {
        endorseButton.on('click', (event) => {
            event.preventDefault();
            const commentID = event.target.parentElement.id;
            const endorse = event.target.id === 'endorse';
            var endorseConfig = {
                method: 'POST',
                url: `/api/endorseComment/${commentID}?endorse=${endorse}`,
                contentType: 'application/json',
            };
            $.ajax(endorseConfig)
                .done(() => {
                    event.target.id = endorse ? 'unendorse' : 'endorse';
                    event.target.innerText = endorse ? 'Un-endorse' : 'Endorse';
                })
                .fail(() => {
                    alert('Failed to endorse/unendorse comment.');
                });
        });
    }
})(window.jQuery);
