
var express = require('express');
var app = express();
var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

passport.use(new FacebookStrategy({
    clientID: "566972150348724",
    clientSecret: "7d4242c332292faf8b31a9e536aac5b2",
    callbackURL: "https://testpassportfacebook.herokuapp.com/auth/facebook/callback"
    // callbackURL: "http://localhost:3000/auth/facebook/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    // placeholder for translating profile into your own custom user object.
    // for now we will just use the profile object returned by Facebook

    return done(null, profile);
  }
));

// Express and Passport Session
var session = require('express-session');
app.use(session({secret: "enter custom sessions secret here"}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function(user, done) {
  // placeholder for custom user serialization
  // null is for errors
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  // placeholder for custom user deserialization.
  // maybe you are getoing to get the user from mongo by id?
  // null is for errors
  done(null, user);
});

// we will call this to start the Facebook Login process
// app.get('/auth/facebook', passport.authenticate('facebook'));


app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { successRedirect: '/',
                                      failureRedirect: '/error' }));
app.get('/auth/facebook/callback', (req, res) => { req.send(403)});



app.get('/', function (req, res) {
  res.send({
    isAuthenticated: req.isAuthenticated(),
    user: req.user
  })
})

app.get('/login',
  // function(req, res, next) {

  //   console.log(req.isAuthenticated())
  //   if (req.isAuthenticated()) {
  //     req.logout();
  //   } 
  //   next();
  // },   
  passport.authenticate('facebook'))

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

// Simple route middleware to ensure user is authenticated.
//  Use this route middleware on any resource that needs to be protected.  If
//  the request is authenticated (typically via a persistent login session),
//  the request will proceed.  Otherwise, the user will be redirected to the
//  login page.
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) { return next(); }
  res.send(403)
}

app.get('/protected', ensureAuthenticated, function(req, res) {
  res.send("acess granted");
});



var server = app.listen(3000, function () {
  console.log('Example app listening at http://%s:%s',
    server.address().address, server.address().port);
});