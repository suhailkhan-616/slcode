const Like = require('../models/like');
const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.toggleLike = async function (req, res) {
    //Like/toggle/?id=abcd&=Post
    try {
        let Likeable;
        let deleted = false;

        if (req.query.type == 'Post') {
            Likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            Likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // if cheack like already Exists
        let existLike = await Like.findOne({
            Likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });
        // if Like is already exist then delete it 
        if (existLike) {
            Likeable.likes.pull(existLike._id);
            Likeable.save();

            existLike.deleteOne();
            deleted = true;

        } else {

            // else make new like
            let newLike = await Like.create({
                user: req.user._id,
                Likeable: req.query.id,
                onModel: req.query.type
            });

            Likeable.likes.push(newLike._id);
            Likeable.save();

        }

        return res.json(200, {
            message: 'Successfull like create',
            data: {
                deleted: deleted
            }
        })




    } catch (err) {
        console.log('Error', err);
        return res.json(500, {
            msg: 'Internal Server Error'
        })
    }

}