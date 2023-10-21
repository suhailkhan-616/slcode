const User = require('../models/user');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const forgetMailer = require('../Mailers/forget');
const Friendship = require('../models/friends');

module.exports.profile = async function (req, res) {
   //For use Manual Authentication

   // console.log('Users Profile');
   // return res.render('user_profile', {
   //    title: 'Profile |',
   // });
   // try
   // if (req.cookies.user_id) {
   // const user = await User.findById(req.cookies.user_id);
   // if (user) {
   //       return res.render('user_profile', {
   //          title: 'Profile |',
   //          user: user
   //       });
   //    }else{
   //       return res.redirect('/users/sign-in');
   //    }
   // }else{
   //    return res.redirect('/users/sign-in');
   // }

   //It is use Passport js manual Authentictaion
   try {
      // when the passport Authentication use
      const user = await User.findById(req.params.id);
      return res.render('user_profile', {
         title: 'Profile |',
         profile_user: user
      });
   } catch (err) {
      console.log('Error in the profile', err);
      // handleErrors(err,res);
   }
}

// Update the profile
// It is with out multer 
// module.exports.update = async function (req, res) {
//    try {

//       if (req.user.id == req.params.id) {
//          await User.findByIdAndUpdate(req.params.id, req.body);
//          req.flash('success', 'Update Successfull !');
//          return res.redirect('/');
//       } else {
//          return res.status(401).send('Unauthorised');
//       }
//    } catch (err) {
//       req.flash('error', err);
//       console.log('Error in update', err)
//    }
// }

// It is use multer to update
module.exports.update = async function (req, res) {
   if (req.user.id == req.params.id) {
      try {
         let user = await User.findById(req.params.id);
         User.uploadedAvatar(req, res, function (err) {
            if (err) {
               console.log('***Error in multer', err);
            }
            user.name = req.body.name;
            user.email = req.body.email;
            if (req.file) {

               if (user.avatar) {
                const avatarPath = (path.join(__dirname, '..', user.avatar));
               //  jab avatar already exists
                if (fs.existsSync(avatarPath)) {
                  fs.unlinkSync(avatarPath);
                }
               }
                  user.avatar = User.avatarPath + '/' + req.file.filename;

               
               //This is saving the path of the uploaded file into the avatar field in the user
            }
            user.save();
            return res.redirect('back');

         })
      } catch (err) {
         req.flash('error', 'Error');
         console.log('Error in update', err);

      }
   } else {
      req.flash('error', 'Unatuthrized');
      return res.status(401).send('Unauthorised');
   }
}

//It is user for views file user_sign-up render to browser
module.exports.signUP = async function (req, res) {
   try {
      if (req.isAuthenticated()) {
         return res.redirect('/users/profile');
      }
      return res.render('user_sign_up', {
         title: 'Slcode | Sign-up'
      });
   } catch (err) {
      console.log('Error in sign-Up', err);
   }
}

//It is use for views file user_sign_in render to browser
module.exports.signIn = function (req, res) {
   try {
      if (req.isAuthenticated()) {
         return res.redirect('/users/profile');
      }
      return res.render('user_sign_in', {
         title: 'Slcode | Sign-In'
      });
   } catch (err) {
      console.log('Eror in sign-in', err);
   }
}

//Get up and date Sign Up for create a user sign up form 
module.exports.create = async function (req, res) {

   if (req.body.password != req.body.confirm_password) {
      req.flash('error', 'X Confirm password does not matches passowrd');
      return res.redirect('back');
   }
   try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
         await User.create(req.body);
         req.flash('success', 'Sign Up Successfull !');
         return res.redirect('/users/sign-in');
      } else {
         req.flash('error', 'User is already exist');
         return res.redirect('back');
      }

   } catch (err) {
      req.flash('error', err);
      console.log('Error', err);
      return res.redirect('back');
   }
};

// Manual Authentication

// module.exports.createSession = async function (req, res) {
//    try {
//       const user = await User.findOne({ email: req.body.email });
//       if (user) {
//          if (user.password != req.body.password) {
//             return res.redirect('back');
//          }
//          res.cookie('user_id', user.id);
//          return res.redirect('/users/profile');
//       } else {
//          return res.redirect('back');
//       }

//    } catch (err) {
//       handleErrors(err, res);
//    }
// }

//Authentication with passport.js 
module.exports.createSession = function (req, res) {
   req.flash('success', 'Logged in Succfully');
   return res.redirect('/');
}

//destroySession
module.exports.destroySession = function (req, res) {
   req.logout(function (err) {
      if (err) {
         console.error('errors while logout', err);
      }
      req.flash('success', 'You have Logged out');
      return res.redirect('/');
   });
}

module.exports.forgetRender = function (req, res) {
   return res.render('forget_in', {
      title: "Reset Password |"
   })
}

module.exports.resetPassword = async function (req, res) {
   try {
      console.log(req.body.email);
      const email = req.body.email
      const user = await User.findOne({ email: email });
      if (user) {
         const String = crypto.randomBytes(10).toString('hex');
         user.token = String;
         console.log(user);
         user.save();
         forgetMailer.reset(user, String);
         req.flash('sucess', 'reset send Email');
         return res.redirect('/');
      }
   } catch (err) {
      res.status(400).json({ massage: 'Error in forget password', err });
      console.log('Error in forgetgetPassword', err);
      return;
      //  req.flash('error',"Email not exists please sign-up and try again");

   }
}

module.exports.updatePassword = async function (req, res) {
   try {
      let token = req.query.token;
      console.log(token);
      //const user = await User.findOne({token:req.query.token}) ;// user with the token exists
      let user = await User.findOne({ token: token });
      console.log(user.token);
      if (user) {
         return res.render('reset_password', {
            title: 'reset Password',
            user_id: user._id // to verify the user
         });
      } else {
         //window.alert('Unauthorized !!');
         req.flash('error', 'unauthorized user');
         return res.redirect('/');
      }
   } catch (err) {
      console.log(`error in updating password ${err}`, err);
   }
}

module.exports.newPassword = async function (req, res) {
   try {
      let user = await User.findById(req.body.user_id);
      user.password = req.body.password;
      user.token = "";
      user.save();
      console.log(user.password);
      req.flash('success', 'Password Updated Successfully!');
      return res.redirect('/users/sign-in');
   } catch (err) {
      console.log(`error in updating password ${err}`, err);
   }
}
module.exports.friendShip = async function (req, res) {
   try {
       console.log("inside friendship controllers");
       let to_user = await User.findById(req.query.to);
       let from_user = await User.findById(req.user._id);
       let deleted = false;
       console.log(to_user);
       console.log(from_user);
       let existingFriendship = await Friendship.findOne({
           from_user: req.user._id,
           to_user: req.query.to
       });

       if (existingFriendship) {
           to_user.friendships.pull(existingFriendship._id);
           from_user.friendships.pull(existingFriendship._id);

           to_user.save();
           from_user.save();
           existingFriendship.remove();

           deleted = true;
       } else {

           let newFriendship = await Friendship.create({
               from_user: from_user,
               to_user: to_user
           });
           to_user.friendships.push(newFriendship);
           from_user.friendships.push(newFriendship);
           to_user.save();
           from_user.save();
       }
       let fromUser = await User.find({})
         return res.render('home',{
            from_user:fromUser
         })
        res.status(200).json({
           message: "friendship is succesfully created!!",
           data: deleted
       });
   } catch (error) {
       console.log("ERROR******", error);
       return res.status(500).json({
           message: "Internal Server Error"
       });
   }
}

module.exports.friendshipDestroy = async function (req, res) {
   try {
    
       let to_user = await User.findById(req.query.to);
       let from_user = await User.findById(req.user._id);

       let existingFriendship = await Friendship.findOne({
           from_user: req.user._id,
           to_user: req.query.to
       });
       to_user.friendships.pull(existingFriendship._id);
       from_user.friendships.pull(existingFriendship._id);

       to_user.save();
       from_user.save();
       existingFriendship.remove();
       return res.redirect('back');
   } catch (error) {
       console.log("ERROR*****", error);
       return res.status(500).json({
           message: "Internal server ERROR"
       })
   }
}