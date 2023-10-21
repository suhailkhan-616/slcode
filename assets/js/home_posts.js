{
    //Method to submit form data for the new post : Using AJAX
    let creatPost = function () {
        let newPostForm = $('#new-post-form');
        newPostForm.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function (data) {
                    console.log(data.data.post);
                    let newPost = newCreatePost(data.data.post);
                    $(`#posts-list-container>ol`).prepend(newPost);
                    deletePost($(' .delete-post-button', newPost));

                    new ToggleLike($(' .toggle-like-button', newPost));

                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();

                },
                error: function (err) {
                    console.log(err.responseText);
                }
            })
        })
    }
    // Method To create Post to DOM
    let newCreatePost = function (post) {
        console.log(post);
        return $(
            ` <li id="post-${post._id}"> 
            <p>
            ${post.content}
                                <small>
                                        <a
                                                href="/posts/destroy/${post._id}">
                                                <button>delete</button></a>
                                </small>
                                        <br>
                                        <small>
                                        ${post.user.name}
                                        </small>
                                        <br>
                                        <small>
                            
                                        <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${post._id}&type=Post">
                                            0 Likes
                                        </a>
                                    
                                </small>
        
        </p>
        <div id="comment-page">
               
                        <form action="/comments/create"
                                method="Post">
                                <input type="text"
                                        name="content"
                                        placeholder="Enter the Comments....."
                                        required>
                                <input type="hidden" name="post"
                                        value="${post._id}">
                                <input type="submit"
                                        value="Add Comment">
                        </form>
                                <div class="post-comments-list">
                                        <ol
                                                id="post-commnets-${post._id}">
                                        </ol>

                                </div>
        </div>
</li>

`)
    }


    //Method to the Delete the post 
    let deletePost = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`post-${data.data.post_id}`).remove();
                },
                error: function (error) {
                    console.log(error.responseText);
                }
            })
        })
    }

    //Create Commnet
    let createCommment = function () {
        let newCommentform = $('#new-comments-form');
        newCommentform.submit(function (e) {
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/comments/create',
                data: newCommentform.serialize(),
                success: function (data) {
                    console.log(data.data.comment);
                    let newComment = newCreateCommentDom(data.data.comment);
                    $(`#post-comments-list>ol`).prepend(newComment);
                    commentDelete($(` .delete-comment`).newComment);

                    new ToggleLike($(' .toggle-like-button', newComment));
                    new Noty({
                        theme: 'relax',
                        text: "Comment published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function (err) {
                    console.log(err.responseText);
                }
            })
        })
    }

    // Method to Comment delete Ajax
    let newCreateCommentDom = function (comment) {
        console.log(comment);
        return $(`<li id="comment-${comment._id}"> 

            <small>
            ${comment.user.name}
            </small>
                    <small>
                            <a
                                    href="/comments/destroy/${comment.id}">
                                    <button>delete</button></a>
                    </small>
                            <small>
                            ${comment.content}
                            </small>

                            <small>
                            
                            <a class="toggle-like-button" data-likes="0" href="/likes/toggle/?id=${comment._id}&type=Comment">
                                0 Likes
                            </a>
                        
                    </small>


                        </li>
        `)
    }

    let commentDelete = function (deleteLink) {
        $(deleteLink).click(function (e) {
            e.preventDefault();
            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function (data) {
                    $(`comment-${data.data.comment_id}`).remove();
                }, error: function (err) {
                    console.log(err.responseText);
                }
            })
        })
    }

    createCommment();
    creatPost();

}