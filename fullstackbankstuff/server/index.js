//DECLARATIONS

//Dependencies
require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , massive = require('massive')

//Deconstruct from env
//Port
const { SERVER_PORT } = process.env;
//Authentication
const { AUTH_DOMAIN, CLIENT_ID, CLIENT_SECRET, CALLBACK_URL } = process.env
//Database
const { CONNECTION_STRING } = process.env
//Express declaration
const app = express();

//TOP LEVEL MIDDLEWARE
app.use(bodyParser.json());


//Session first
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true
}));

//Auth
//Passport initialize
app.use(passport.initialize());
//Passport connect to session
app.use(passport.session());

//Invoke massive
massive(CONNECTION_STRING).then((db) => {
    app.set('db', db)
})

//Strategy
passport.use(new Auth0Strategy({
    domain: AUTH_DOMAIN,
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: CALLBACK_URL,
    scope: 'openid profile'
}, (accessToken, refreshToken, extraParams, profile, done) => {//receives profile from auth callback endpoint

    let { displayName, picture, user_id } = profile;
    const db = app.get('db');//database connection

    db.find_user([user_id]).then(function (users) { //checks if user doesn't exist and adds them to database, if user does exist, returns user
        if (!users[0]) {
            db.create_user([displayName, 'email@email.com', picture, user_id])
                .then(user => {
                    return done(null, user[0].id)
                })
        } else {
            return done(null, users[0].id)
        }
    })
}))
//Serialize User, receives profile data from auth strategy callback, ties profile to session id in session store and cookie
passport.serializeUser((id, done) => {
    return done(null, id);
})
//Deserialize User, checks session id from cookie, receives profile data and adds it to req.user, is hit when session user hits endpoint
passport.deserializeUser((id, done) => {
    const db = app.get('db')
    db.find_session_user([id])
    .then(function(user){
        return done(null,user[0])
    })
})

//Auth endpoints
app.get('/auth', passport.authenticate('auth0'));//kicks off authentication process, redirects us to auth0, then redirects to callback with data
app.get('/auth/callback', passport.authenticate('auth0', {//kicks off authentication process again to make sure is authenticated and receives data and inserts data into profile parameter, sends profile to strategy
    successRedirect: 'http://localhost:3000/#/private',
    failureRedirect: 'http://localhost:3000/'
}));

//Endpoints
//Login
app.get('/auth/me', (req,res)=>{
    if(!req.user){
        res.status(404).send('User not found.');
    } else {
        res.status(200).send(req.user);
    }
})
//Logout
app.get('/auth/logout', function(req,res){
    req.logOut();
    res.redirect('http://localhost:3000/')
})

//LISTENER
app.listen(SERVER_PORT, () => {
    console.log(`That's no moon! It's a port ${SERVER_PORT}`)
});