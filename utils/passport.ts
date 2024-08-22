import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

passport.use(strategy);
passport.serializeUser((user: Express.User, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });
    done(null, user);
  } catch (error) {
    done(error);
  }
});
