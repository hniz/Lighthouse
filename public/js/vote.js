(function ($) {
    const voteButton = $('.vote-button');
    if (voteButton.length !== 0) {
        voteButton.on('click', (event) => {
            event.preventDefault();
            let postID = event.target.parentElement.id.split('-')[1];
            if (!postID) {
                postID = event.target.parentElement.id.split('-')[0];
            }
            const vote = event.target.parentElement.id.startsWith('upvote');
            var voteConfig = {
                method: 'POST',
                url: `/api/vote/post/${postID}?vote=${+vote}`,
                contentType: 'application/json',
            };
            const scoreLabel = $(`#post-score-${postID}`);

            $.ajax(voteConfig)
                .done(({vote, score}) => {
                    scoreLabel.text(score);
                    event.target.parentElement.id = vote
                        ? `unupvote-${postID}`
                        : `upvote-${postID}`;
                    event.target.src = vote
                        ? '/public/img/full_like.svg'
                        : '/public/img/empty_like.svg';
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
            console.log(event.target.parentElement.id);
            let commentId = event.target.parentElement.id.split('-')[1];
            if (!commentId) {
                commentId = event.target.parentElement.id.split('-')[0];
            }
            console.log(commentId);
            const vote = event.target.parentElement.id.startsWith('upvote');
            var voteConfig = {
                method: 'POST',
                url: `/api/vote/comment/${commentId}?vote=${+vote}`,
                contentType: 'application/json',
            };
            const scoreLabel = $(`#comment-score-${commentId}`);
            $.ajax(voteConfig)
                .done(({vote, score}) => {
                    scoreLabel.text(score);
                    event.target.parentElement.id = vote
                        ? `unupvote-${commentId}`
                        : `upvote-${commentId}`;
                    event.target.src = vote
                        ? '/public/img/full_like.svg'
                        : '/public/img/empty_like.svg';
                })
                .fail(() => {
                    alert('Failed to vote on comment.');
                });
        });
    }
})(window.jQuery);
