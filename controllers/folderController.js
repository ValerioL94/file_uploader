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
exports.folder_delete_get = exports.folder_edit_post = exports.folder_edit_get = exports.folder_create_post = exports.folder_create_get = exports.folder_list_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const client_1 = __importDefault(require("../prisma/client"));
exports.folder_list_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const folders = yield client_1.default.folder.findMany({
        orderBy: { updatedAt: 'desc' },
    });
    res.render('folder_list', { title: 'Your folders', user: req.user, folders });
}));
exports.folder_create_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('folder_form', {
        title: 'New folder',
        user: req.user,
        type: 'create',
    });
}));
exports.folder_create_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    yield client_1.default.folder.create({
        data: {
            title: req.body.title,
            user: { connect: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id } },
        },
    });
    res.redirect('/folders');
}));
exports.folder_edit_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const folder = yield client_1.default.folder.findUnique({
        where: { id: req.params.folderId },
    });
    res.render('folder_form', {
        title: 'Update folder',
        user: req.user,
        type: 'update',
        folder,
    });
}));
exports.folder_edit_post = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const newTitle = req.body.title;
    yield client_1.default.folder.update({
        where: { id: req.params.folderId },
        data: { title: newTitle },
    });
    res.redirect('/folders');
}));
exports.folder_delete_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    yield client_1.default.folder.delete({
        where: { id: req.params.folderId },
    });
    res.redirect('/folders');
}));
