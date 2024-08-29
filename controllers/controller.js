const passport = require('../passport/passport');
const query = require('../models/query');
const { body, validationResult } = require('express-validator');

async function homePageGet(req, res) {
  const messages = await query.getAllMessages();
  res.render('home', {
    user: req.user,
    messages: messages,
  });
}

async function registerPageGet(req, res) {
  res.render('register', { errors: null });
}

async function loginPageGet(req, res) {
  res.render('login');
}

async function userPageGet(req, res) {
  const messages = await query.getAllMessages();
  res.render('user', {
    user: req.user,
    messages: messages,
  });
}

async function adminPageGet(req, res) {
  res.send('Arrived Admin Page!');
}

async function messagePageGet(req, res) {
  res.render('messageForm');
}

const validiteRegister = [
  body('firstName')
    .trim()
    .optional({ checkFalsy: true })
    .isAlphanumeric()
    .withMessage('First name must contain only letters and numbers.'),
  body('lastName')
    .trim()
    .optional({ checkFalsy: true })
    .isAlphanumeric()
    .withMessage('Last name must contain only letters and numbers.'),
  body('email').trim().isEmail().withMessage('Please enter a valid email address.'),
];

const registerPost = [
  validiteRegister,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('register', {
        errors: errors.array(),
      });
    }
    try {
      await query.addNewUser(req);
      res.redirect('/login');
    } catch (err) {
      res.status(500).send(err);
    }
  },
];

async function messagePost(req, res) {
  try {
    await query.addNewMessage(req);
    res.redirect('/user');
  } catch (err) {
    res.status(500).send(err);
  }
}

async function memberCodePost(req, res) {
  if (req.body.code === 'secret') {
    await query.userMembershipOn(req);
  }
  res.redirect('/user');
}

async function deleteMsgPost(req, res) {
  await query.deleteMsg(req);
  res.redirect('/user');
}

async function loginPost(req, res, next) {
  passport.authenticate('local', {
    successRedirect: '/user',
    failureRedirect: '/login',
  })(req, res, next);
}

async function logoutGet(req, res) {
  req.logout((err) => {
    if (err) {
      res.status(500).send(err);
    }
    res.redirect('/');
  });
}

module.exports = {
  homePageGet,
  loginPageGet,
  registerPageGet,
  registerPost,
  userPageGet,
  adminPageGet,
  messagePageGet,
  messagePost,
  memberCodePost,
  deleteMsgPost,
  loginPost,
  logoutGet,
};
