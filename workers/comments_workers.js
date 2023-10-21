const queue = require('../config/kue');

const commentsMailer = require('../Mailers/comment_mailer');

queue.process('emails',function(job,done){
    console.log('emails workers is prforming the job', job.data);
    commentsMailer.newComment(job.data);
    done()
})