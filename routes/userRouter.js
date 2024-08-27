"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRouter = express_1.default.Router();
const userController_1 = require("../controllers/userController");
userRouter.route('/sign-up').get(userController_1.sign_up_get).post(userController_1.sign_up_post);
userRouter.route('/log-in').get(userController_1.log_in_get).post(userController_1.log_in_post);
userRouter.get('/log-out', userController_1.log_out_get);
exports.default = userRouter;
