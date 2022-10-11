import express from 'express';
import { LoginUser, RegisterUser,getUniqueUsersMovies,getUsers } from '../controller/userController';

const router = express.Router();


/* GET home page. */
router.get('/register',(req,res)=>{
  res.render("register")
} )

router.post('/register',RegisterUser)
router.get('/dashboard',getUniqueUsersMovies)
router.get('/unique',getUsers)

router.get('/login',(req,res)=>{
  res.render("login")
})
router.post('/login',LoginUser)
router.get('/logout', (req,res)=>{
   
  try{
    res.clearCookie("token")
    res.clearCookie("id")  
    res.redirect('/')
  }catch(err){
    res.status(400).json({msg:"error"})
  }
})



export default router;
