//Step-1
const express = require('express');
const env = require('./config/environment');
const app = express();
const cookieParser = require('cookie-parser');
const port = 8000;

//Step-5
const expressLayouts = require('express-ejs-layouts');


//Step-7
const db = require('./config/mongoose');
 
//Step-8 express-session used for cookie
const session = require('express-session');
const passport = require('passport');
const passporLocal = require('./config/passport-local-stretegy');
const passportJWT = require('./config/passport-jwt-stretegy');
//Step 11
const passportGoogle = require('./config/passport-google-oauth2-stretagy');
//Step-8
const MongoStore = require('connect-mongo');
// Step-9
const sassMiddleware = require('node-sass-middleware');
//Step-10
const flash = require('connect-flash');
const customMware = require('./config/middleware');

const cors = require('cors'); // Import the 'cors' package.


app.use(cors());


//Setup chat Server the Chat soket.io
const chatServer = require('http').createServer(app);
const chatSockets = require('./config/chat_socket_io').chatSockets(chatServer,{
    cors: {
      origin: '*',
    }
    });
chatServer.listen(5000);
console.log('chat Socket is listening on port 5000');

const path = require('path');
//middle wear
// Use the cors middleware to allow requests from 'http://localhost:8000'.
chatServer.prependListener("request", (req, res) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
 });


app.use(sassMiddleware({
    src: path.join(__dirname,env.assests_path),
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}));
app.use(express.urlencoded());

//cookies 
app.use(cookieParser());

//Assets//Step-4
app.use(express.static(env.assests_path));
//Step-11 multer
app.use('/upload',express.static(__dirname +'/upload'));

//Step-6
//Include the Css and Scripts file for sub pages into the layouts
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

//layouts//Step-5
app.use(expressLayouts);

//Step-3
//setting up the Engine like EJS
app.set('view engine', 'ejs');
app.set('views', './views');

app.use(session({
    name: 'slcode',
    //TODO CHANGE THE SECRET BEFORE DEPLOYMENT IN PRODUCTION MODE
    secret: 'blahsomething',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100)
    },
    store: MongoStore.create(
        {
            mongoUrl: 'mongodb://127.0.0.1:27017/insta_talk',

            autoRemove: 'disabled'
        },
        function (err) {
            console.log(err || 'connect-mongodb setup ok');
        })
}));


app.use(passport.initialize());
app.use(passport.session());
//After the setAuthentication function in passport-local-stretegy
app.use(passport.setAuthenticatedUser);

// use flash 
app.use(flash());
// middleware use for user_controller login and log out
app.use(customMware.setFlash);

//use express router//Step-2
app.use('/', require('./routes'));

//Step-1
app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server : ${err}`);
    }
    console.log(`Server is running the port : ${port}`);
})
