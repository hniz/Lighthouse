(function ($) {
    const endorseButton = $('.endorse-button');
    if (endorseButton.length !== 0) {
        endorseButton.on('click', (event) => {
            event.preventDefault();
            const postID = event.target.parentElement.id;
            const endorse = event.target.id === 'endorse';
            var endorseConfig = {
                method: 'POST',
                url: `/api/endorse/${postID}?endorse=${endorse}`,
                contentType: 'application/json',
            };
            $.ajax(endorseConfig)
                .done(() => {
                    event.target.id = endorse ? 'unendorse' : 'endorse';
                    event.target.innerText = endorse ? 'Un-endorse Post' : 'Endorse Post';
                })
                .fail(() => {
                    alert('Failed to endorse/unendorse post.');
                });
        });
    }
})(window.jQuery);
