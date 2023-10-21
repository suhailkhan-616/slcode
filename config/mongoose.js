// Step-7
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/slcode_development');

const db = mongoose.connection;

db.on('error',console.error.bind(console,"Error the mongoose Connection"));


db.once('open',function(){
    console.log("Successfully Connected to MongoDB");
});

module.exports = db;