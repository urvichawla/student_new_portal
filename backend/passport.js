const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const Student = require('./models/Student');

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, async (accessToken, refreshToken, profile, done) => {
  let user = await Student.findOne({ email: profile.emails[0].value });
  if (!user) {
    user = await Student.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      password: 'google', // or random string, not used
      feesPaid: false,
    });
  } else if (!user.name && profile.displayName) {
    // Update name if missing
    user.name = profile.displayName;
    await user.save();
  }
  return done(null, user);
}));