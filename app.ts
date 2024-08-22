import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import expressLayouts from 'express-ejs-layouts';
import path from 'path';
import expressSession from 'express-session';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import { PrismaClient } from '@prisma/client';
dotenv.config(); // to be removed?

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(expressLayouts);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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

app.get('/', (req: Request, res: Response) => {
  res.render('index');
});

app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});
