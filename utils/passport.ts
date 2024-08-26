import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import prisma from '../prisma/client';

const strategy = new LocalStrategy(
  { usernameField: 'email' },
  async (username, password, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { email: username },
      });
      if (!user) {
        return done(null, false, { message: 'Incorrect E-mail' });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: 'Incorrect password' });
      }
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
);

declare namespace Express{
  interface User {
    id?: string;
  }
}

passport.use(strategy);
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (userId: Express.User["id"], done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
