const express = require('express');
const app = express();
const port = 8000;
const expressLayouts = require('express-ejs-layouts');

//Assets
app.use(express.static('./assets'));

//Include the Css and Scripts file for sub pages into the layouts
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);

//layouts
app.use(expressLayouts);

//setting up the Engine like EJS
app.set('view engine','ejs');
app.set('views','./views');


//use express router
app.use('/', require('./routes'));
app.listen(port, function(err){
    if(err){
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running the port : ${port}`);
})
