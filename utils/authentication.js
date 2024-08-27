"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = isAuth;
function isAuth(req, res, next) {
    if (req.isAuthenticated())
        return next();
    else
        res.redirect('/');
}
