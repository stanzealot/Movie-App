import express,{Request,Response,NextFunction}
 from 'express'
 import {v4 as uuidv4} from 'uuid'
 import {registerSchema,options,loginSchema,generateToken} from '../utility/util'
 import {UserInstance } from '../models/users'
 import bcrypt from 'bcryptjs'
import { MovieInstance } from '../models/index' 

export async function RegisterUser(req:Request, res:Response, next:NextFunction) {
    const id = uuidv4()
    try{ 
        const validationResult = registerSchema.validate(req.body,options)
        if( validationResult.error){
           return res.status(400).json({
              Error:validationResult.error.details[0].message
           })
        }
        const duplicatEmail = await UserInstance.findOne({where:{email:req.body.email}})
        if(duplicatEmail){
         return res.status(409).json({
            msg:"Email is used, please change email"
         })  
        }

        const username = await UserInstance.findOne({where:{username:req.body.username}})

        if(username){
         return res.status(409).json({
            msg:"username number is used"
         })
        }
        const passwordHash = await bcrypt.hash(req.body.password,8)
       const record = await UserInstance.create({ 
          id:id,
          fullname:req.body.fullname,
          username:req.body.username,
          email:req.body.email,
          password:passwordHash
        })
        res.redirect("/movies")
      //  res.status(201).json({
      //      msg:"You have successfully created a user",
      //      record
      //  })
    }catch(err){
       res.status(500).json({
        msg:'failed to register',
        route:'/register'
       })
    }
 
 }


 export async function LoginUser(req:Request, res:Response, next:NextFunction) {
   const id = uuidv4()
   try{ 
       const validationResult = loginSchema.validate(req.body,options)
       if( validationResult.error){
          return res.status(400).json({
             Error:validationResult.error.details[0].message
          })
       }
       const User = await UserInstance.findOne({where:{email:req.body.email}}) as unknown as {[key:string]:string}
        
       const {id} = User
       const token = generateToken({id})
      const validUser = await bcrypt.compare(req.body.password, User.password);

      if(!validUser){

         res.status(401).json({
            message:"Password do not match"
        })
      }

      if(validUser){
         res.cookie("token",token,{
            httpOnly:true,
            secure:true
         })
         res.redirect('/movies')
         // res.status(200).json({
         //     message:"Successfully logged in",
         //     token,
         //     User

         // })
      }

}catch(err){
    console.log(err)
   res.status(500).json({
    msg:'failed to login',
    route:'/login'
   })
}

}


export async function getUsers(
   req: Request,
   res: Response,
   next: NextFunction
 ) {
   try {
     const limit = req.query?.limit as number | undefined;
     const offset = req.query?.offset as number | undefined;
     //  const record = await TodoInstance.findAll({where: {},limit, offset})
     const record = await UserInstance.findAndCountAll({ limit, offset,
     include:[{
      model:MovieInstance,
      as:'tlmovies'
     }
     ]
     });
     res.status(200).json({
       msg: "You have successfully fetch all todos",
       count: record.count,
       record: record.rows,
     });
   } catch (error) {
     res.status(500).json({
       msg: "failed to read",
       route: "/read",
     });
   }
 }