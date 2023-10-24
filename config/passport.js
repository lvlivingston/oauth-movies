const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/user');

// this is a verified callback function
passport.use(new GoogleStrategy(
    // this is the first argument, the configuration object
    {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK
    },
    // The next arugment is a function... the verify callback functio. And we're going to use async/await!
    async function(accessToken, refreshToken, profile, cb) {
      // A user has logged in with OAuth...
      // we're going to wrap in a try / catch block in case something goes wrong or to catch an error
      try {
        // A user has logged in with OAuth...
        let user = await User.findOne({ googleId: profile.id });
        // If an existing user is found, we'll provide it to passport
        if (user) return cb(null, user);
        // If no user exists... we have a new user via OAuth and need to create them
        user = await User.create({
            name: profile.displayName,
            googleId: profile.id,
            email: profile.emails[0].value,
            avatar: profile.photos[0].value
      });
      return cb(null, user);        
      } catch (err) {
        return cb(err);
      }
    }
));

// still configuring passport here... to tell passport what to put in the server side session allowing us to find the user document in the database
passport.serializeUser(function(user, cb) {
    cb(null, user._id);
  });

// now deserializing the user... this doc gets called everytime a request comes in from an authenticated user
passport.deserializeUser(async function(userId, cb) {
  // It's nice to be able to use await in-line for promises vs .then .catch
  cb(null, await User.findById(userId));
});