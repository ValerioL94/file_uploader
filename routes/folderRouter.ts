import express from 'express';
const folderRouter = express.Router();
import isAuth from '../utils/authentication';
import {
  folders_get,
  folder_create_get,
  folder_create_post,
} from '../controllers/folderController';

folderRouter.use(isAuth);
folderRouter.get('/', folders_get);
folderRouter.get('/create', folder_create_get);
folderRouter.post('/create', folder_create_post);

export default folderRouter;
