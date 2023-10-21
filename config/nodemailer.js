const nodemailer = require('nodemailer');
const ejs = require('ejs');
const path = require('path');

let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: "Suhailk616@gmail.com",
        pass:'gukx vcll kfru fovl'

    }
});

let renderTemplate = (data, relativePath) => {
    let mailHTML;
    ejs.renderFile(
        path.join(__dirname, "../views/mailers", relativePath),
        data,
        function (err, template) {
            if (err) { console.log('Error found in renderTemplete'); return }

            mailHTML = template;
        }


    );
    return mailHTML;
}

module.exports = {
    transporter: transporter,
    renderTemplate: renderTemplate
}