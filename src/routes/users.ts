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

router.get('/movies/new',auth,(req,res)=>{
    res.render('new');
})


router.post('/movies',auth,createMovie)
router.get('/movies/:id',auth,async (req,res,next)=>{
    let singleRecord = await getMovie(req,res,next)
    res.render("show",{singleRecord})
})
router.get('/movies/:id/edit',auth,async (req,res,next)=>{
    let singleRecord = await getMovie(req,res,next)
    res.render('edit',{singleRecord})
})
router.patch('/movies/:id',auth,updateMovie)
router.delete('/movies/:id',auth,deleteMovie)

export default router;
