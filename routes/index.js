var express = require('express');
var router = express.Router();
const passport = require('passport');

// This app has no "home" page, but your projects should 😀
router.get('/', function(req, res, next) {
  res.redirect('/movies');
});

// Google OAuth login route on the front end when user clicks login
router.get('/auth/google', passport.authenticate(
  // this takes 2 arguments...
  // The first one is the strategy... Which passport strategy is being used?
  'google',
  // the second one is a configuration object
  {
    // Requesting the user's profile and email comes from OAuth specs, it's always a string
    scope: ['profile', 'email'],
    // Optionally you can force them to pick account every time, you can turn off if you want
    prompt:'select_account'
  }
));

// Now need to handle the Google OAuth callback route
router.get('/oauth2callback', passport.authenticate(
  // still working with the Google strategy
  'google',
  {
    // we get to define these two
    successRedirect: '/movies',
    // change to what's best for your application... there's no landing page for this one, so has to go to movies
    failureRedirect: '/movies'
  }
));

// Now we have to create the OAuth logout route, another get request and an inline middleware request
router.get('/logout', function(req, res){
  // tells passport to log out, and takes a callback function
  req.logout(function() {
    // then redirects the user to wherever we want to send them (usually a landing page) when they log out
    res.redirect('/movies');
  });
});

module.exports = router;
