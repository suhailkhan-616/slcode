const nodemailer = require('../config/nodemailer');


module.exports.reset = (user, token) => {
    console.log('Inside new token',token);
    let htmlString = nodemailer.renderTemplate({ token: token }, '/password/forget-password.ejs');
    nodemailer.transporter.sendMail({
        form: "Suhailk616@gmail.com",
        to: user.email,
        subject: "Reset Password",
        html: htmlString
    }, function (err, info) {
        if(err){
            console.log(`error in sending mail ${err}`,err);

        }
    });
} 