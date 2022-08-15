import express from 'express';
import {auth} from '../middleware/auth'
import {createMovie,getMovies,getMovie,updateMovie,deleteMovie} from "../controller/index"
var router = express.Router();


/* GET users listing. */
    /*   use when returning the result from the controller function     */
// router.get('/',async (req,res,next)=>{
//    let record = await getMovies(req,res,next)
//    res.render('index',{record})

// });
router.get('/',getMovies)

router.get('/new',(req,res)=>{
    res.render('new');
})
router.post('/',auth,createMovie)
router.get('/:id',async (req,res,next)=>{
    let singleRecord = await getMovie(req,res,next)
    res.render("show",{singleRecord})
})
router.get('/:id/edit',async (req,res,next)=>{
    let singleRecord = await getMovie(req,res,next)
    res.render('edit',{singleRecord})
})
router.patch('/:id',auth,updateMovie)
router.delete('/:id',auth,deleteMovie)

export default router;
