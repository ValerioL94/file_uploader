import asyncHandler from 'express-async-handler';
import { body, validationResult } from 'express-validator';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';

export const sign_up_get = asyncHandler(async (req, res, next) => {
  res.render('sign-up', { title: 'Sign-up', user: req.user });
});

type TempUser = {
  username: string;
  email: string;
  password?: string;
};

export const sign_up_post = [
  body('username')
    .trim()
    .isLength({ min: 4 })
    .escape()
    .withMessage('Username must contain at least 4 characters'),
  body('email')
    .trim()
    .escape()
    .isEmail()
    .withMessage('Enter a valid E-mail')
    .custom(async (value) => {
      const email = await prisma.user.findUnique({
        where: { email: value },
      });
      if (email) {
        throw new Error('E-mail already in use');
      }
    }),
  body('password', 'Password should contain at least 8 characters').isLength({
    min: 8,
  }),
  body('passwordConfirmation', 'Password mismatch').custom((value, { req }) => {
    return value === req.body.password;
  }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    const newUser: TempUser = {
      username: req.body.username,
      email: req.body.email,
    };
    if (!errors.isEmpty()) {
      return res.render('sign-up', {
        title: 'Sign-up',
        newUser,
        errors: errors.array(),
      });
    } else {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          return next(err);
        }
        newUser.password = hashedPassword;
        await prisma.user.create({
          data: {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
          },
        });
        res.redirect('log-in');
      });
    }
  }),
];

declare module 'express-session' {
  interface Session {
    messages?: string | string[];
  }
}

export const log_in_get = asyncHandler(async (req, res, next) => {
  res.render('log-in', {
    title: 'Log-in',
    user: req.user,
    errors: req.session.messages,
  });
  delete req.session.messages;
  req.session.save();
});

export const log_in_post = passport.authenticate('local', {
  successRedirect: '/',
  failureRedirect: '/user/log-in',
  failureMessage: true,
});

export const log_out_get = asyncHandler(async (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});
