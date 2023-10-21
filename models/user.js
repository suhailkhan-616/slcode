const mongoose = require('mongoose');
//first Of All Step-11
//Multer use to uploading file 
const multer = require('multer');
const path = require('path');
const AVATAR_PATH = path.join('/upload/users/avatars');

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
    type:String,
    required:true,
    unique:true
    },
    name:{
        type:String,
        required:true
    },
    avatar:{
        type:String
    },
    token:{
      type:String,
      default:''
  },
  friendships:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Friendship'
  }]
},{
    timestamps:true
});

//multer uploading and save file
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname,'..',AVATAR_PATH));
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      cb(null, file.fieldname + '-' + uniqueSuffix)
    }
  });

  //Static 
  userSchema.statics.uploadedAvatar = multer({storage:storage}).single('avatar');
  userSchema.statics.avatarPath = AVATAR_PATH;

const User = mongoose.model('User',userSchema);

module.exports = User;