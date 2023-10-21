const Post = require('../../../models/post');
const Comment =require('../../../models/comment');

module.exports.postApi = async function(req,res){
    const post_list = await Post.find({}).populate('user').populate({
        path:'comments',
        populate:{
            path:'user'
        }
    });
    return res.json(200,{
        message:"Lists of Posts",
        posts:post_list
    });
}

module.exports.destroyPost = async function (req, res) {
    try {
        const post = await Post.findById(req.params.id);
        // .id means converting the object id into String
        if (post.user == req.user.id) {
            post.deleteOne();

            await Comment.deleteMany({ post: req.params.id });

            return  res.json(200,{
                message:"Posts and Comments Deleted"
            });
        }else{
            return res.json(401,{
                message:"You can not delete Post"
            })
        }
    } catch (err) {
        console.log('Error is destroyPost', err);
        return res.json(200,{
            message:"Internal Server Error"
        })
    }
}