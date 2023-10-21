const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req,res){
     console.log('Its work ');
    // return res.end('<h1>Express is Ready up for Slcode</h1>');
    // console.log(req.cookies);
    // res.cookie('user_id',25);
    // return res.render('home',{
    //     title:'Home'
    // });

    //Populate the user 
    try{
        // Change :: Populate the Likes of each Post and Comments
        const post_list = await Post.find({}).populate('user').populate({
            path:'comments',
            populate:{
                path:'user'
            },
            populate:{
                path:'likes'
            }
        }).populate('likes');
    const user = await User.find({});
        return res.render('home',{
            title:"SLCODE | Home",
            list_post:post_list,
            all_users : user
        });
    }catch(err){
        console.log('Error in Postfind',err);
    }

}

// modile.exports.actionsNane =function(req,res){}
