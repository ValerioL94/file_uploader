import express, { Express, NextFunction, Request, Response } from 'express';
import createError, { HttpError } from 'http-errors';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import expressSession from 'express-session';
import passport from 'passport';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
dotenv.config(); // to be removed?

import indexRouter from './routes/indexRouter';
import userRouter from './routes/userRouter';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(
  expressSession({
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000, //ms
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
  })
);

app.use(passport.session());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  next();
});

app.use('/', indexRouter);
app.use('/user', userRouter);
// app.use('/folders', folderRouter);
// app.use('/files', fileRouter);
// app.use('/share', shareRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
