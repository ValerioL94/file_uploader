import express from 'express';
const userRouter = express.Router();

userRouter.get('/sign-up', (req, res, next) => {
  res.send('WiP');
});
userRouter.get('/log-in', (req, res, next) => {
  res.send('WiP');
});

export default userRouter;
