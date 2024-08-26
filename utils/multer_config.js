"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
exports.getURI = getURI;
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { files: 1 },
});
function getURI(buffer, type) {
    const b64 = Buffer.from(buffer).toString('base64');
    let dataURI = 'data:' + type + ';base64,' + b64;
    return dataURI;
}
