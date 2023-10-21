const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.ObjectId
    },
    Likeable:{
        type:String,
        required:true,
        refPath:'onModel'
    },
    onModel:{
        type:String,
        required:true,
        enum:['Post','Comment']
    }
},
{
    timestamps:true
});

const Like = mongoose.model('Like',LikeSchema);

module.exports = Like