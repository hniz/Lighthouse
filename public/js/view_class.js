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
})(window.jQuery);
