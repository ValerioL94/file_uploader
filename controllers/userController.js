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
exports.log_out_get = exports.log_in_post = exports.log_in_get = exports.sign_up_post = exports.sign_up_get = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const express_validator_1 = require("express-validator");
const passport_1 = __importDefault(require("passport"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const client_1 = __importDefault(require("../prisma/client"));
exports.sign_up_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('sign-up', { title: 'Sign-up', user: req.user });
}));
exports.sign_up_post = [
    (0, express_validator_1.body)('username')
        .trim()
        .isLength({ min: 4 })
        .escape()
        .withMessage('Username must contain at least 4 characters'),
    (0, express_validator_1.body)('email')
        .trim()
        .escape()
        .isEmail()
        .withMessage('Enter a valid E-mail')
        .custom((value) => __awaiter(void 0, void 0, void 0, function* () {
        const email = yield client_1.default.user.findUnique({
            where: { email: value },
        });
        if (email) {
            throw new Error('E-mail already in use');
        }
    })),
    (0, express_validator_1.body)('password', 'Password should contain at least 8 characters').isLength({
        min: 8,
    }),
    (0, express_validator_1.body)('passwordConfirmation', 'Password mismatch').custom((value, { req }) => {
        return value === req.body.password;
    }),
    (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const errors = (0, express_validator_1.validationResult)(req);
        const newUser = {
            username: req.body.username,
            email: req.body.email,
        };
        if (!errors.isEmpty()) {
            return res.render('sign-up', {
                title: 'Sign-up',
                newUser,
                errors: errors.array(),
            });
        }
        else {
            bcryptjs_1.default.hash(req.body.password, 10, (err, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
                if (err) {
                    return next(err);
                }
                newUser.password = hashedPassword;
                yield client_1.default.user.create({
                    data: {
                        username: newUser.username,
                        email: newUser.email,
                        password: newUser.password,
                    },
                });
                res.redirect('log-in');
            }));
        }
    })),
];
exports.log_in_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    res.render('log-in', {
        title: 'Log-in',
        user: req.user,
        errors: req.session.messages,
    });
    delete req.session.messages;
    req.session.save();
}));
exports.log_in_post = passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/user/log-in',
    failureMessage: true,
});
exports.log_out_get = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    req.logout((err) => {
        if (err) {
            return next(err);
        }
        res.redirect('/');
    });
}));
