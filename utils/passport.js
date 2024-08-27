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
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = __importDefault(require("../prisma/client"));
const strategy = new passport_local_1.Strategy({ usernameField: 'email' }, (username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.default.user.findUnique({
            where: { email: username },
        });
        if (!user) {
            return done(null, false, { message: 'Incorrect E-mail' });
        }
        const match = yield bcryptjs_1.default.compare(password, user.password);
        if (!match) {
            return done(null, false, { message: 'Incorrect password' });
        }
        return done(null, user);
    }
    catch (error) {
        return done(error);
    }
}));
passport_1.default.use(strategy);
passport_1.default.serializeUser((user, done) => {
    done(null, user.id);
});
passport_1.default.deserializeUser((userId, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield client_1.default.user.findUnique({
            where: { id: userId },
        });
        done(null, user);
    }
    catch (error) {
        done(error);
    }
}));
