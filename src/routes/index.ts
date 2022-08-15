import express from 'express';
import { LoginUser, RegisterUser } from '../controller/userController';

const router = express.Router();


/* GET home page. */
router.get('/register',(req,res)=>{
  res.render("register")
} )

router.post('/register',RegisterUser)
router.get('/login',(req,res)=>{
  res.render("login")
})
router.post('/login',LoginUser)





export default router;
