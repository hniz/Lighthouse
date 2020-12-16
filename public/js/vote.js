(function ($) {
    const voteButton = $('.vote-button');
    if (voteButton.length !== 0) {
        voteButton.on('click', (event) => {
            event.preventDefault();
            const postID = event.target.parentElement.id;
            const vote = event.target.id === 'upvote';
            var voteConfig = {
                method: 'POST',
                url: `/api/vote/post/${postID}?vote=${+vote}`,
                contentType: 'application/json',
            };
            $.ajax(voteConfig)
                .done(() => {
                    const score = event.target.parentElement.children.namedItem(
                        'post-score'
                    );
                    const newScore = Number(score.innerText) + (vote ? 1 : -1);
                    score.innerText = newScore;
                    event.target.id = vote ? 'unupvote' : 'upvote';
                    event.target.innerText = vote ? '-1' : '+1';
                })
                .fail(() => {
                    alert('Failed to vote on post.');
                });
        });
    }
    const voteCommentButton = $('.vote-comment-button');
    if (voteCommentButton.length !== 0) {
        voteCommentButton.on('click', (event) => {
            event.preventDefault();
            const commentId = event.target.parentElement.id;
            const vote = event.target.id === 'upvote';
            var voteConfig = {
                method: 'POST',
                url: `/api/vote/comment/${commentId}?vote=${+vote}`,
                contentType: 'application/json',
            };
            $.ajax(voteConfig)
                .done(() => {
                    const score = event.target.parentElement.children.namedItem(
                        'comment-score'
                    );
                    const newScore = Number(score.innerText) + (vote ? 1 : -1);
                    score.innerText = newScore;
                    event.target.id = vote ? 'unupvote' : 'upvote';
                    event.target.innerText = vote ? '-1' : '+1';
                })
                .fail(() => {
                    alert('Failed to vote on comment.');
                });
        });
    }
})(window.jQuery);
