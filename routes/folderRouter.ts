import express from 'express';
const folderRouter = express.Router();
import isAuth from '../utils/authentication';

import {
  folder_list_get,
  folder_create_get,
  folder_create_post,
  folder_edit_get,
  folder_edit_post,
  folder_delete_get,
  file_list_get,
} from '../controllers/folderController';

folderRouter.use(isAuth);
folderRouter.get('/', folder_list_get);
folderRouter.route('/create').get(folder_create_get).post(folder_create_post);
folderRouter
  .route('/:folderId/edit')
  .get(folder_edit_get)
  .post(folder_edit_post);
folderRouter.get('/:folderId/delete', folder_delete_get);
folderRouter.use('/:folderId/files', file_list_get);

export default folderRouter;
