module.exports.profile = function(req,res){
    console.log('Users Profile');
     return res.render('user_profile',{
        title:'Profile |',
     })
}