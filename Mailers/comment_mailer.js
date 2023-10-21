const nodemailer = require('../config/nodemailer');

//this is another way exports
exports.newComment = (comment)=>{
    console.log('Inside new Comment Mailers',comment);
    let htmlString = nodemailer.renderTemplate({comment:comment},'/comments/new_comments.ejs');
    nodemailer.transporter.sendMail({
        from:"Suhailk616@gmail.com",
        to:comment.user.email,
        subject:"New Comment Published",
        html:htmlString
    },(err,info)=>{
        if(err){console.log('Error in publish', err); return }

        // console.log('Message Sent',info);
        return ;
    });
}
