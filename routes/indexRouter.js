"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const indexRouter = express_1.default.Router();
const indexController_1 = require("../controllers/indexController");
indexRouter.get('/', indexController_1.index_get);
exports.default = indexRouter;
