"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_errors_1 = __importDefault(require("http-errors"));
const express_ejs_layouts_1 = __importDefault(require("express-ejs-layouts"));
const path_1 = __importDefault(require("path"));
const express_session_1 = __importDefault(require("express-session"));
const passport_1 = __importDefault(require("passport"));
const prisma_session_store_1 = require("@quixo3/prisma-session-store");
const client_1 = require("@prisma/client");
require("./utils/passport");
const indexRouter_1 = __importDefault(require("./routes/indexRouter"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const folderRouter_1 = __importDefault(require("./routes/folderRouter"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
app.use(express_ejs_layouts_1.default);
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use((0, express_session_1.default)({
    cookie: {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms
    },
    secret: 'a santa at nasa',
    resave: true,
    saveUninitialized: true,
    store: new prisma_session_store_1.PrismaSessionStore(new client_1.PrismaClient(), {
        checkPeriod: 2 * 60 * 1000, //ms
        dbRecordIdIsSessionId: true,
        dbRecordIdFunction: undefined,
    }),
}));
app.use(passport_1.default.session());
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});
app.use('/', indexRouter_1.default);
app.use('/user', userRouter_1.default);
app.use('/folders', folderRouter_1.default);
// app.use('/share', shareRouter);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Error', user: req.user });
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
