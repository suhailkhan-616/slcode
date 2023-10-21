const mongoose = require('mongoose');

const postShcema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    //Include the array of Ids of all comments in the post schema itselfs
    comments:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    likes:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Like'
    }]
},
    {
        timestamps: true
    });

const Post = mongoose.model('Post', postShcema);

module.exports = Post