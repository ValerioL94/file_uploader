import express from 'express';
const userRouter = express.Router();
import {
  sign_up_get,
  sign_up_post,
  log_in_get,
  log_in_post,
  log_out_get,
} from '../controllers/userController';

userRouter.route('/sign-up').get(sign_up_get).post(sign_up_post);
userRouter.route('/log-in').get(log_in_get).post(log_in_post);
userRouter.get('/log-out', log_out_get);

export default userRouter;
