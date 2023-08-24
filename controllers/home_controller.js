// modile.exports.actionsNane =function(req,res){}
module.exports.home = function(req,res){
     console.log('Its work and try another function');
    // return res.end('<h1>Express is Ready up for Slcode</h1>');
    return res.render('home',{
        title:'Home'
    });
}