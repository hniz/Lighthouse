(function ($) {
    const voteButton = $('.vote-button');
    if (voteButton.length !== 0) {
        voteButton.each(function (ind, element) {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                let target = event.target;
                if (target.tagName === 'BUTTON') {
                    target = target.firstChild;
                }
                console.log(target);

                let postID = target.parentElement.parentElement.id.split(
                    '-'
                )[1];
                
                const vote = target.parentElement.id.startsWith(
                    'upvote'
                );
                var voteConfig = {
                    method: 'POST',
                    url: `/api/vote/post/${postID}?vote=${+vote}`,
                    contentType: 'application/json',
                };
                const scoreLabel = $(`#post-score-${postID}`);

                $.ajax(voteConfig)
                    .done(({ vote, score }) => {
                        scoreLabel.text(score);
                        
                        target.parentElement.id = vote
                            ? `unupvote-${postID}`
                            : `upvote-${postID}`;
                        target.src = vote
                            ? '/public/img/full_like.svg'
                            : '/public/img/empty_like.svg';
                        target.alt = vote
                            ? 'Remove Upvote Button'
                            : 'Upvote Button';
                    })
                    .fail(() => {
                        alert('Failed to vote on post.');
                    });
            });
        });
    }
    const voteCommentButton = $('.vote-comment-button');
    if (voteCommentButton.length !== 0) {
        voteCommentButton.each(function (ind, element) {
            element.addEventListener('click', (event) => {
                event.preventDefault();
                let target = event.target;
                if (target.tagName === 'BUTTON') {
                    target = target.firstChild;
                }
                console.log(target);

                let commentId = target.parentElement.parentElement.id.split(
                    '-'
                )[1];
                
                const vote = target.parentElement.id.startsWith(
                    'upvote'
                );
                var voteConfig = {
                    method: 'POST',
                    url: `/api/vote/comment/${commentId}?vote=${+vote}`,
                    contentType: 'application/json',
                };
                const scoreLabel = $(`#comment-score-${commentId}`);
                $.ajax(voteConfig)
                    .done(({ vote, score }) => {
                        scoreLabel.text(score);

                        console.log(target);
                        target.parentElement.id = vote
                            ? `unupvote-${commentId}`
                            : `upvote-${commentId}`;
                        target.src = vote
                            ? '/public/img/full_like.svg'
                            : '/public/img/empty_like.svg';
                        target.alt = vote
                            ? 'Remove Upvote Button'
                            : 'Upvote Button';
                    })
                    .fail(() => {
                        alert('Failed to vote on comment.');
                    });
            });
        });
    }
})(window.jQuery);
