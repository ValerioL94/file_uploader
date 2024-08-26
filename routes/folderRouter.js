"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const folderRouter = express_1.default.Router();
const authentication_1 = __importDefault(require("../utils/authentication"));
const folderController_1 = require("../controllers/folderController");
const fileRouter_1 = __importDefault(require("./fileRouter"));
folderRouter.use(authentication_1.default);
folderRouter.get('/', folderController_1.folder_list_get);
folderRouter.route('/create').get(folderController_1.folder_create_get).post(folderController_1.folder_create_post);
folderRouter
    .route('/:folderId/edit')
    .get(folderController_1.folder_edit_get)
    .post(folderController_1.folder_edit_post);
folderRouter.get('/:folderId/delete', folderController_1.folder_delete_get);
folderRouter.use('/:folderId/files', fileRouter_1.default);
exports.default = folderRouter;
