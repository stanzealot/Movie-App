"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMovie = exports.updateMovie = exports.getMovie = exports.getMovies = exports.createMovie = void 0;
const models_1 = require("../models");
const uuid_1 = require("uuid");
const users_1 = require("../models/users");
const util_1 = require("../utility/util");
async function createMovie(req, res, next) {
    // create a todo
    const verified = req.user;
    const id = (0, uuid_1.v4)();
    let movie = { id, ...req.body, userId: verified.id };
    try {
        const { error } = util_1.creatMovieSchema.validate(req.body, util_1.options);
        if (error) {
            const msg = error.details.map(err => err.message).join(',');
            return res.status(400).json({
                Error: msg
            });
        }
        const record = await models_1.MovieInstance.create(movie);
        return res.redirect('/users/dashboard');
        // res.status(201).json({ 
        //   msg: "You have successfully added a movie", 
        //   record
        //  });
    }
    catch (err) {
        res.status(500).json({
            msg: "Failed to create",
            route: "/create",
        });
    }
}
exports.createMovie = createMovie;
async function getMovies(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await models_1.MovieInstance.findAll({ where: {}, limit, offset,
            include: [{
                    model: users_1.UserInstance,
                    attributes: ['id', 'fullname', 'username', 'email'],
                    as: 'user'
                }
            ] });
        //return record
        return res.render("index", { record });
        //  res.status(200).json({
        //     msg:"You have successfully fetch all todos",
        //     record
        //  })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({
            msg: "failed to read",
            route: "/read"
        });
    }
}
exports.getMovies = getMovies;
async function getMovie(req, res, next) {
    try {
        const { id } = req.params;
        const singleRecord = await models_1.MovieInstance.findOne({ where: { id } });
        return singleRecord;
        //res.render("show",{singleRecord})
        //  return res.status(200).json({
        //     msg:"Successfully gotten user information",
        //     record
        //  })
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to read single todo",
            route: "/read/:id"
        });
    }
}
exports.getMovie = getMovie;
async function updateMovie(req, res, next) {
    try {
        const { id } = req.params;
        const { title, description, image, price } = req.body;
        const { error } = util_1.creatMovieSchema.validate(req.body, util_1.options);
        if (error) {
            const msg = error.details.map(err => err.message).join(',');
            return res.status(400).json({
                Error: msg
            });
        }
        const record = await models_1.MovieInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                Error: "Cannot find existing todo",
            });
        }
        const updatedrecord = await record.update({
            title: title,
            description: description,
            image: image,
            price: price
        });
        res.redirect("/users/dashboard");
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to update",
            route: "/update/:id"
        });
    }
}
exports.updateMovie = updateMovie;
async function deleteMovie(req, res, next) {
    try {
        const { id } = req.params;
        const record = await models_1.MovieInstance.findOne({ where: { id } });
        if (!record) {
            return res.status(404).json({
                msg: "Cannot find todo"
            });
        }
        const deletedRecord = await record.destroy();
        res.redirect('/users/dashboard');
        //  return res.status(200).json({
        //     msg: "Todo deleted successfully",
        //     deletedRecord 
        //  })
    }
    catch (error) {
        res.status(500).json({
            msg: "failed to delete",
            route: "/delete/:id"
        });
    }
}
exports.deleteMovie = deleteMovie;
