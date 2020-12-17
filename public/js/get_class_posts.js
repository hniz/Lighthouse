(function getClassPosts($) {
    var classPosts = $('.post-container');
    var classList = $('.class-list');
    classList.find('li').on('click', function (event) {
        const classid = event.target.id;
        var requestConfig = {
            method: 'GET',
            url: '/api/getClassPosts',
            contentType: 'application/json',
            data: { id: classid },
        };
        classPosts.html(`<h3>Loading posts from ${event.target.innerText}...`);
        $.ajax(requestConfig).then(function handlePostResponse(
            responseMessage
        ) {
            const posts = $(responseMessage);
            const endorseButton = posts.find('.endorse-button');
            if (endorseButton.length !== 0) {
                endorseButton.on('click', (event) => {
                    event.preventDefault();
                    const postID = event.target.id.split('-')[1];
                    const endorse = event.target.id.startsWith('endorse');
                    var endorseConfig = {
                        method: 'POST',
                        url: `/api/endorse/${postID}?endorse=${endorse}`,
                        contentType: 'application/json',
                    };
                    $.ajax(endorseConfig)
                        .done(({ endorse, postId }) => {
                            event.target.id =
                                endorse === 'true'
                                    ? `unendorse-${postId}`
                                    : `endorse-${postId}`;
                            event.target.innerText =
                                endorse === 'true'
                                    ? 'Un-endorse Post'
                                    : 'Endorse Post';
                            if (endorse === 'true') {
                                event.target.parentElement.parentElement.classList.add(
                                    'post-endorse'
                                );
                            } else {
                                event.target.parentElement.parentElement.classList.remove(
                                    'post-endorse'
                                );
                            }
                        })
                        .fail(() => {
                            alert('Failed to endorse/unendorse post.');
                        });
                });
            }
            const voteButton = posts.find('.vote-button');
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
            const endorseCommentButton = posts.find('.endorse-comment-button');
            if (endorseCommentButton.length !== 0) {
                endorseCommentButton.on('click', (event) => {
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
            const voteCommentButton = posts.find('.vote-comment-button');
            if (voteCommentButton.length !== 0) {
                voteCommentButton.each(function (ind, element) {
                    element.addEventListener('click', (event) => {
                        event.preventDefault();
                        let target = event.target;
                        if (target.tagName === 'BUTTON') {
                            target = target.firstChild;
                        }
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
            const commentForms = posts.find('.comment-form');
            commentForms.on('submit', function (commentevent) {
                commentevent.preventDefault();
                console.log(commentevent);
                const id = commentevent.target.id.split('-')[1];
                const children = commentevent.target.children;
                const comment = children.namedItem(`comment-content-${id}`)
                    .value;
                const parentid = children.namedItem(`parent-id-${id}`).value;

                const parentPostLI = commentevent.target.parentElement;
                const currentTarget = parentPostLI.children;

                let hasErrors = false;
                let errors = [];
                let hasErrorDiv = false;
                let i = 0;
                for (i = 0; i < currentTarget.length; i++) {
                    if (
                        currentTarget[i].className ===
                        'dashboard-comment-error-div'
                    ) {
                        hasErrorDiv = true;
                        break;
                    }
                }

                let errorDiv;
                let errorUL;

                if (hasErrorDiv) {
                    errorDiv = currentTarget[i];
                    errorUL = errorDiv.firstChild;

                    while (errorUL.firstChild) {
                        errorUL.removeChild(errorUL.firstChild);
                    }
                } else {
                    errorDiv = document.createElement('div');
                    errorDiv.className = 'dashboard-comment-error-div';

                    errorUL = document.createElement('ul');
                    errorUL.className = 'dashboard-comment-error-list';
                }

                errorDiv.hidden = true;

                if (!comment) {
                    hasErrors = true;
                    errors.push('No comment body was entered.');
                }

                if (!parentid) {
                    hasErrors = true;
                    errors.push('No parent id given.');
                }

                if (hasErrors) {
                    errorDiv.hidden = false;
                    errors.forEach((element) => {
                        let li = document.createElement('li');
                        li.innerHTML = element;
                        errorUL.appendChild(li);
                    });

                    if (!hasErrorDiv) {
                        errorDiv.appendChild(errorUL);
                        parentPostLI.appendChild(errorDiv);
                    }
                } else {
                    const commentConfig = {
                        method: 'POST',
                        url: 'api/comment',
                        contentType: 'application/json',
                        data: JSON.stringify({
                            'comment-content': comment,
                            'parent-id': parentid,
                        }),
                    };
                    $.ajax(commentConfig)
                        .done(() => {
                            event.target.click();
                        })
                        .fail(() => {
                            alert('Comment failed to post');
                        });
                }
            });
            const tagLinks = classPosts.find('#class-tags');
            tagLinks.on('click', function (tagevent) {
                tagevent.preventDefault();
                const href = tagevent.target.href;
                try {
                    const tag = href.match(/tag=.*/)[0].slice(4);
                    const tagRequestConfig = {
                        method: 'GET',
                        url: 'api/getClassPosts',
                        contentType: 'application/json',
                        data: { id: classid, tag },
                    };
                    $.ajax(tagRequestConfig).then((response) => {
                        handlePostResponse(response);
                        const clearFilter = $('<button>Clear Filter</button>');
                        clearFilter.on('click', () => event.target.click());
                        classPosts.find('#class-tags').append(clearFilter);
                    });
                } catch (e) {
                    console.warn('Malformed tag url: ', e);
                }
            });
            classPosts.html(posts);
        });
    });
})(window.jQuery);
