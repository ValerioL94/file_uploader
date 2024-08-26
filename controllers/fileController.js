"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.file_download_get = exports.file_delete_get = exports.folder_delete_get = exports.file_edit_post = exports.file_edit_get = exports.file_detail_get = exports.file_upload_post = exports.file_upload_get = exports.file_list_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client"));
const multer_config_1 = require("../utils/multer_config");
const cloudinary_config_1 = require("../utils/cloudinary_config");
exports.file_list_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield client_1.default.folder.findUnique({
        where: { id: req.params.folderId },
        include: { files: true },
    });
    res.render('file_list', {
        title: folder === null || folder === void 0 ? void 0 : folder.title,
        folder,
        files: folder === null || folder === void 0 ? void 0 : folder.files,
        user: req.user,
    });
}));
exports.file_upload_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('file_form', {
        title: 'File upload',
        user: req.user,
        type: 'create',
    });
}));
exports.file_upload_post = [
    multer_config_1.upload.single('uploaded_file'),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const folder = yield client_1.default.folder.findUnique({
            where: { id: req.params.folderId },
        });
        if (!req.file) {
            return res.render('file_form', {
                title: 'File upload',
                user: req.user,
                error: 'No file selected',
            });
        }
        if (req.file && req.file.size > 1048576) {
            return res.render('file_form', {
                title: 'File upload',
                user: req.user,
                error: 'File size exceeded',
            });
        }
        const dataURI = (0, multer_config_1.getURI)(req.file.buffer, req.file.mimetype);
        const result = yield (0, cloudinary_config_1.handleUpload)(dataURI, folder.title);
        yield client_1.default.file.create({
            data: {
                title: req.body.file_name,
                size: result.bytes,
                url: result.secure_url,
                resource_type: result.resource_type,
                format: result.format,
                folder: { connect: { id: folder.id } },
            },
        });
        res.redirect(`/folders/${folder.id}/files`);
    })),
];
exports.file_detail_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield client_1.default.file.findUnique({
        where: { id: req.params.fileId },
    });
    res.render('file_detail', { title: file === null || file === void 0 ? void 0 : file.title, file, user: req.user });
}));
exports.file_edit_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield client_1.default.file.findUnique({
        where: { id: req.params.fileId },
    });
    res.render('file_form', {
        title: 'Update file title',
        user: req.user,
        type: 'update',
        file,
    });
}));
exports.file_edit_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newTitle = req.body.file_name;
    yield client_1.default.file.update({
        where: { id: req.params.fileId },
        data: { title: newTitle },
    });
    res.redirect(`/folders/${req.params.folderId}/files`);
}));
exports.folder_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.folder.delete({
        where: { id: req.params.folderId },
    });
    res.redirect('/folders');
}));
exports.file_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.file.delete({
        where: { id: req.params.fileId },
    });
    res.redirect(`/folders/${req.params.folderId}/files`);
}));
const https_1 = __importDefault(require("https"));
exports.file_download_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const file = yield client_1.default.file.findUnique({
        where: { id: req.params.fileId },
    });
    const fileName = `${file === null || file === void 0 ? void 0 : file.title}.${file === null || file === void 0 ? void 0 : file.format}`;
    https_1.default
        .get(file.url, function (myfile) {
        res.set('Content-disposition', 'attachment; filename=' + encodeURI(fileName));
        res.set({ 'Content-Type': `${file === null || file === void 0 ? void 0 : file.resource_type}/${file === null || file === void 0 ? void 0 : file.format}` });
        myfile.pipe(res);
    })
        .on('error', (err) => {
        return next(err);
    });
}));
