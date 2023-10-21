const Comment = require('../models/comment');
const Post = require('../models/post');
const commnetsMailer = require('../Mailers/comment_mailer');
const commentEmailWorker = require('../workers/comments_workers');
const queue = require('../config/kue');
const Like = require('../models/like');


module.exports.create = async function (req, res) {
    try {
        const post = await Post.findById(req.body.post);
        if (post) {
            let comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id
            });
            post.comments.push(comment);
            post.save();
             comment = await comment.populate('user', 'name email'); 
            //  commnetsMailer.newComment(comment);
           let job = queue.create('emails',comment).save(function(err){
            if(err){
                console.log('Error in create Queue',err);
                return;
            }
            console.log("job Queued",job.id);
           })
             if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment: comment
                    },
                    message: "Comment Create"
                })
            }

            req.flash('success', 'Your Comment Published!');
            return res.redirect('/');
        }

    } catch (err) {
        req.flash('error', err);
        console.log('Error in comment controller', err);
        return;
    }
}

module.exports.destroyComment = async function (req, res) {
    try {
        const comment = await Comment.findById(req.params.id);
        if (comment.user == req.user.id) {
            let postId = comment.post;
            comment.deleteOne();

            Post.findByIdAndUpdate(postId, { $poll: { commnets: req.params.id } });

            // Change the Like each delete Comment

            await Like.deleteMany({Likeable:comment._id,onModel:'Comment'}) 

            req.flash('success', 'Your Comments Deleted');
            if(req.xhr){
                return res.status(200).json({
                    comment_id:req.params.id,
                    message:"Comment Delete!"
                })
            }
            return res.redirect('/');
        } else {
            return res.redirect('/');
        }

    } catch (err) {
        req.flash('error', err);
        console.log('Error in destroyComment ', err);

    }
}