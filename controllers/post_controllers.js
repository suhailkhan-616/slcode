const Post = require('../models/post');
const Comment = require('../models/comment');
const Like = require('../models/like');

module.exports.post = async function (req, res) {
    try {
        let post = await Post.create({
            content: req.body.content,
            user: req.user._id
        });
        req.flash('success', 'Your Post Published!');
        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post: post
                },
                message: "Post is Created"
            })
        }
        return res.redirect('back');

    } catch (err) {
        req.flash('error', err);
        return res.redirect('back');
    }
}

module.exports.destroyPost = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        // .id means converting the object id into String
        if (post.user == req.user.id) {
            
            // Change the Likes deleted Post and Comments
            await Like.deleteMany({Likeable:post,onModel:'Post'});
            await Like.deleteMany({_id:{$in:post.comments}});
            post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            req.flash('success', 'Your Post and Comments Deleted');
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                })
            }
            return res.redirect('back');
        }
    } catch (err) {
        req.flash('error', 'Error');
        console.log('Error is destroyPost', err);
        return res.redirect('back');
    }
}