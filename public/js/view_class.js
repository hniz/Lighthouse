(function ($) {
    let params = new URLSearchParams(window.location.search);
    
    const tagLinks = $('#class-tags li');
    const origPosts = $('#post-list').html();
    const resetFilterButton = $('#reset-filter');
    if(params.has('tag')){
        const postList = $('#post-list');
        const entries = $(origPosts).find('>li');
        const filteredPosts = entries.filter((ind, elem) => {
            return elem.children.namedItem(tag) !== null;
        });
        if (filteredPosts.length === 0) {
            postList.html(
                '<p>There are no posts matching the selected filter.</p>'
            );
        } else {
            postList.html(filteredPosts);
        }
        resetFilterButton.show();
    }
    tagLinks.on('click', (event) => {
        event.preventDefault();
        const tag = event.target.text;
        const postList = $('#post-list');
        const entries = $(origPosts).find('>li');
        const filteredPosts = entries.filter((ind, elem) => {
            return elem.children.namedItem(tag) !== null;
        });
        if (filteredPosts.length === 0) {
            postList.html(
                '<p>There are no posts matching the selected filter.</p>'
            );
        } else {
            postList.html(filteredPosts);
        }
        resetFilterButton.show();
    });
    resetFilterButton.on('click', (event) => {
        event.preventDefault();
        resetFilterButton.hide();
        const postList = $('#post-list');
        postList.html($(origPosts));
    });
    const endorseButton = $('#class-content').find('.endorse-button');
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
