(function ($) {
    let params = new URLSearchParams(window.location.search);

    const tagLinks = $('#class-tags li');
    const resetFilterButton = $('#reset-filter');
    if (params.has('tag')) {
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
        postList.hide();
        const entries = postList.find('>li');
        const filteredPosts = entries.filter((ind, elem) => {
            const id = elem.id;
            const tagItem = postList.find(`#${id}-${tag}`);
            if (tagItem.length === 0) {
                elem.hidden = true;
            }
            return tagItem.length !== 0;
        });
        if (filteredPosts.length === 0) {
            $('#no-posts-filter').show();
        }
        postList.show();

        resetFilterButton.show();
    });
    resetFilterButton.on('click', (event) => {
        event.preventDefault();
        resetFilterButton.hide();
        const postList = $('#post-list');
        const entries = postList.find('>li');
        entries.each((ind, elem) => {
            elem.hidden = false;
        });
        $('#no-posts-filter').hide();

    });
})(window.jQuery);
