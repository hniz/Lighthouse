(function ($) {
    let params = new URLSearchParams(window.location.search);

    const tagLinks = $('#class-tags li');
    const resetFilterButton = $('#reset-filter');
    if (params.has('tag')) {
        const tag = params.get('tag');
        const postList = $('#post-list');
        postList.hide();
        const entries = postList.find('>li');
        const filteredPosts = entries.filter((ind, elem) => {
            const id = elem.id;
            const tagItem = postList.find(
                `#${id}-${tag.replace(/ /g, '_')}`
            );
            if (tagItem.length === 0) {
                elem.hidden = true;
            }else{
                elem.hidden = false;
            }
            return tagItem.length !== 0;
        });
        if (filteredPosts.length === 0) {
            $('#no-posts-filter').show();
        }else{
            $('#no-posts-filter').hide();
        }
        postList.show();

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
            const tagItem = postList.find(
                `#${id}-${tag.replace(/ /g, '_')}`
            );
            if (tagItem.length === 0) {
                elem.hidden = true;
            }else{
                elem.hidden = false;
            }
            return tagItem.length !== 0;
        });
        if (filteredPosts.length === 0) {
            $('#no-posts-filter').show();
        }else{
            $('#no-posts-filter').hide();
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
