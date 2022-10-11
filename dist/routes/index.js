"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controller/userController");
const router = express_1.default.Router();
/* GET home page. */
router.get('/register', (req, res) => {
    res.render("register");
});
router.post('/register', userController_1.RegisterUser);
router.get('/dashboard', userController_1.getUniqueUsersMovies);
router.get('/unique', userController_1.getUsers);
router.get('/login', (req, res) => {
    res.render("login");
});
router.post('/login', userController_1.LoginUser);
router.get('/logout', (req, res) => {
    try {
        res.clearCookie("token");
        res.clearCookie("id");
        res.redirect('/');
    }
    catch (err) {
        res.status(400).json({ msg: "error" });
    }
});
exports.default = router;
