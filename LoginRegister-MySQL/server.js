const express = require("express");
const app = express();
const db = require('./config/db.js');
const session = require("express-session");
const cors = require('cors');

let whiteList = [
    'http://localhost:3000',
    'http://localhost:4500'
];

let corsOption = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin){
            callback(null,true);
        }else{
            callback(new Error('Not allowed by CORS'));
        }
    }
}

const register = require('./routes/register');
const login = require('./routes/login');
const {
    PORT = process.env.PORT || 4500,
    NODE_ENV = 'development',
    SESS_SECRET = 'ssh! quiet, it is a secret!',
    SESS_NAME = 'sid',
    SESS_LIFETIME = 1000*60*60*2
} = process.env;

db.authenticate().then(() => console.log("successfully connected to database"));

app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOption));
app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie:{
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: true
    }
}))
app.use(register);
app.use(login);


app.listen(PORT, () => console.log(`Server is running at http://localhost:${PORT}`))
