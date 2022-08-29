"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUniqueUsersMovies = exports.getUsers = exports.LoginUser = exports.RegisterUser = void 0;
const uuid_1 = require("uuid");
const util_1 = require("../utility/util");
const users_1 = require("../models/users");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const index_1 = require("../models/index");
async function RegisterUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = util_1.registerSchema.validate(req.body, util_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const duplicatEmail = await users_1.UserInstance.findOne({ where: { email: req.body.email } });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please change email"
            });
        }
        const username = await users_1.UserInstance.findOne({ where: { username: req.body.username } });
        if (username) {
            return res.status(409).json({
                msg: "username number is used"
            });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const record = await users_1.UserInstance.create({
            id: id,
            fullname: req.body.fullname,
            username: req.body.username,
            email: req.body.email,
            password: passwordHash
        });
        res.redirect("/movies");
        //  res.status(201).json({
        //      msg:"You have successfully created a user",
        //      record
        //  })
    }
    catch (err) {
        res.status(500).json({
            msg: 'failed to register',
            route: '/register'
        });
    }
}
exports.RegisterUser = RegisterUser;
async function LoginUser(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const validationResult = util_1.loginSchema.validate(req.body, util_1.options);
        if (validationResult.error) {
            return res.status(400).json({
                Error: validationResult.error.details[0].message
            });
        }
        const User = await users_1.UserInstance.findOne({
            where: { email: req.body.email },
            include: [{ model: index_1.MovieInstance, as: "tlmovies" }]
        });
        const { id } = User;
        const token = (0, util_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, User.password);
        if (!validUser) {
            res.status(401).json({
                message: "Password do not match"
            });
        }
        if (validUser) {
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60 * 24
            });
            res.cookie("id", id, {
                httpOnly: true,
                maxAge: 1000 * 60 * 24
            });
            return res.redirect('/dashboard');
            // res.status(200).json({
            //     message:"Successfully logged in",
            //     token,
            //     User
            // })
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: 'failed to login',
            route: '/login'
        });
    }
}
exports.LoginUser = LoginUser;
// export async function LogoutUser(req:Request, res:Response, next:NextFunction) {
//   try{ 
//         res.clearCookie("token")  
//         res.clearCookie("id")     
// }catch(err){
//    console.log(err)
//   res.status(500).json({
//    msg:'failed to login',
//    route:'/login'
//   })
// }
// }
async function getUsers(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await users_1.UserInstance.findAndCountAll({ limit, offset,
            include: [{
                    model: index_1.MovieInstance,
                    as: 'tlmovies'
                }
            ]
        });
        res.status(200).json({
            msg: "You have successfully fetch all movies",
            count: record.count,
            record: record.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUsers = getUsers;
async function getUniqueUsersMovies(req, res, next) {
    let id = req.cookies.id;
    try {
        //   const limit = req.query?.limit as number | undefined;
        //   const offset = req.query?.offset as number | undefined;
        //  const record = await TodoInstance.findAll({where: {},limit, offset})
        const record = await users_1.UserInstance.findOne({ where: { id },
            include: [{
                    model: index_1.MovieInstance,
                    as: 'tlmovies'
                }
            ]
        });
        res.render("dashboard", { record });
        //   res.status(200).json({
        //     msg: "You have successfully fetch all Movies",
        //     count: record,
        //     record: record
        //   });
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read",
            route: "/read",
        });
    }
}
exports.getUniqueUsersMovies = getUniqueUsersMovies;
