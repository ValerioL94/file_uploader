import express from 'express';
const fileRouter = express.Router({ mergeParams: true });
import isAuth from '../utils/authentication';
import {
  file_delete_get,
  file_detail_get,
  file_download_get,
  file_edit_get,
  file_edit_post,
  file_list_get,
  file_upload_get,
  file_upload_post,
} from '../controllers/fileController';

fileRouter.use(isAuth);
fileRouter.get('/', file_list_get);
fileRouter.route('/upload').get(file_upload_get).post(file_upload_post);
fileRouter.route('/:fileId/edit').get(file_edit_get).post(file_edit_post);
fileRouter.get('/:fileId/delete', file_delete_get);
fileRouter.get('/:fileId/download', file_download_get);
fileRouter.get('/:fileId', file_detail_get);
export default fileRouter;
