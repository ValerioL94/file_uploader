import express from 'express';
const indexRouter = express.Router();
import { index } from '../controllers/indexController';

indexRouter.get('/', index);

export default indexRouter;
