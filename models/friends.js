const mongoose = require('mongoose');

const friendsSchema = new mongoose.Schema({
    form_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    to_user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }
},{
    timestamps:true

});


const Friendship = mongoose.model('Friendship',friendsSchema);

module.exports = Friendship;