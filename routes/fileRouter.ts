import express from 'express';
const fileRouter = express.Router({ mergeParams: true });
import isAuth from '../utils/authentication';
import {
  file_list_get,
  file_upload_get,
  file_upload_post,
} from '../controllers/fileController';

fileRouter.use(isAuth);
fileRouter.get('/', file_list_get);
fileRouter.route('/upload').get(file_upload_get).post(file_upload_post);

export default fileRouter;
