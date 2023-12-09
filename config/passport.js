const User = require("../models/User");
const passport = require("passport");
const mongoose = require("mongoose");

const GoogleStrategy = require("passport-google-oauth2").Strategy;
//Google Strateg
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },

    async function (accessToken, refreshToken, profile, cb) {
      try {
        mongoose.connect(process.env.MONGODB_URI);
        const user = await User.findOne({ googleId: profile.id });
        console.log(user);
        if (!user) {
          const newUser = new User({
            name: profile.displayName,
            email: profile.emails[0].value,
            googleId: profile.id,
            avatar: profile.photos[0].value,
          });
          await newUser.save();
          cb(null, newUser);
        }
        cb(null, user);
      } catch (error) {
        return cb(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  mongoose.connect(process.env.MONGODB_URI);

  const user = await User.findById(id);
  done(null, user);
});

// check if the user is authenticated
passport.checkAuthentication = function (req, res, next) {
  // if the user is sign in, then pass on the request to the next function(controller's action)

  if (req.isAuthenticated()) {
    return next();
  }
  // if the user is not sign in to the page
  return res.redirect("/api/profile");
};

passport.setAuthenticatedUser = function (req, res, next) {
  if (req.isAuthenticated()) {
    // req.user contains the current signed in user from the session cookie and we are just sending this to the locals for the views
    res.locals.user = req.user;
  }
  next();
};
