"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const index_1 = require("../controller/index");
var router = express_1.default.Router();
/* GET users listing. */
/*   use when returning the result from the controller function     */
// router.get('/',async (req,res,next)=>{
//    let record = await getMovies(req,res,next)
//    res.render('index',{record})
// });
router.get('/', index_1.getMovies);
router.get('/new', auth_1.auth, (req, res) => {
    res.render('new');
});
router.post('/', auth_1.auth, index_1.createMovie);
router.get('/:id', async (req, res, next) => {
    let singleRecord = await (0, index_1.getMovie)(req, res, next);
    res.render("show", { singleRecord });
});
router.get('/:id/edit', async (req, res, next) => {
    let singleRecord = await (0, index_1.getMovie)(req, res, next);
    res.render('edit', { singleRecord });
});
router.patch('/:id', auth_1.auth, index_1.updateMovie);
router.delete('/:id', auth_1.auth, index_1.deleteMovie);
exports.default = router;
