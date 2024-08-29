const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { pool } = require('../models/db');
const { getUser } = require('../models/query');
const { isPasswordValid } = require('./password');
const customField = {
  usernameField: 'email',
  passportField: 'password',
};

const verification = async (email, password, done) => {
  try {
    const rows = await getUser(email);
    const user = rows[0];
    if (!user) {
      return done(null, false);
    }
    const match = await isPasswordValid(password, user.password);

    if (!match) {
      return done(null, false);
    }
    return done(null, user);
  } catch (err) {
    return done(err);
  }
};

passport.use(new LocalStrategy(customField, verification));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
    const user = rows[0];
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
