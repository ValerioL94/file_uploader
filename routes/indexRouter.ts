import express from 'express';
const indexRouter = express.Router();
import { index_get } from '../controllers/indexController';

indexRouter.get('/', index_get);

export default indexRouter;
