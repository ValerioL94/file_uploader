"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileRouter = express_1.default.Router({ mergeParams: true });
const authentication_1 = __importDefault(require("../utils/authentication"));
const fileController_1 = require("../controllers/fileController");
fileRouter.use(authentication_1.default);
fileRouter.get('/', fileController_1.file_list_get);
fileRouter.route('/upload').get(fileController_1.file_upload_get).post(fileController_1.file_upload_post);
fileRouter.route('/:fileId/edit').get(fileController_1.file_edit_get).post(fileController_1.file_edit_post);
fileRouter.get('/:fileId/delete', fileController_1.file_delete_get);
fileRouter.get('/:fileId/download', fileController_1.file_download_get);
fileRouter.get('/:fileId', fileController_1.file_detail_get);
exports.default = fileRouter;
