import express,{Request,Response,NextFunction} from "express";
import { MovieInstance } from "../models";
import {v4 as uuid} from  "uuid";
import { UserInstance } from "../models/users";
import {creatMovieSchema,updateMovieSchema,options} from '../utility/util'
import { any } from "joi";

export async function createMovie(req: Request | any, res: Response, next: NextFunction) {
    // create a todo
    const verified = req.user;
    const id = uuid();
    let movie = { id ,...req.body, userId: verified.id };
    try {
      const {error} = creatMovieSchema.validate(req.body,options)
         if( error){
            const msg = error.details.map(err => err.message).join(',')
            return res.status(400).json({
               Error:msg
            })
         }
      const record = await MovieInstance.create(movie);

     return res.redirect('/movies');
     
      // res.status(201).json({ 
      //   msg: "You have successfully added a movie", 
      //   record
      //  });
    } catch (err) {
      res.status(500).json({
        msg: "Failed to create",
        route: "/create",
      });
    }  
  }


  export async function getMovies(req:Request, res:Response, next:NextFunction) {
    try{ 
       const limit = req.query?.limit as number | undefined
       const offset = req.query?.offset as number | undefined
       const record = await MovieInstance.findAll({where: {},limit, offset,
        include:[{
        model:UserInstance,
        attributes:['id', 'fullname','username', 'email'],
        as:'user'
       }
       ]})

       //return record
      return res.render("index",{record})
      //  res.status(200).json({
      //     msg:"You have successfully fetch all todos",
      //     record
      //  })
  }catch(error){
   console.log(error)
     res.status(500).json({
        msg:"failed to read",
        route:"/read"
     })
  }
  
  }

  export async function getMovie(req:Request, res:Response, next:NextFunction) {
    try{ 
     const  {id} = req.params
    const singleRecord = await MovieInstance.findOne({where: {id}})

    return singleRecord
    //res.render("show",{singleRecord})
   //  return res.status(200).json({
   //     msg:"Successfully gotten user information",
   //     record
   //  })
   
   }catch(error){
     res.status(500).json({
        msg:"failed to read single todo",
        route:"/read/:id"
     })
   }
   
   }

   export async function updateMovie(req:Request, res:Response, next:NextFunction) {
    try{ 
       const  {id} = req.params
       
       const {title,description,image,price} = req.body
       const {error} = creatMovieSchema.validate(req.body,options)
         if( error){
            const msg = error.details.map(err => err.message).join(',')
            return res.status(400).json({
               Error:msg
            })
         }
   
       const record = await MovieInstance.findOne({where: {id}})
        if(!record){
          return res.status(404).json({
             Error:"Cannot find existing todo",
          })
        }
        
       
        const updatedrecord = await record.update({
           title:title,
           description:description,
           image:image,
           price:price
          
        })
       res.redirect("/movies")
   }catch(error){
     res.status(500).json({
        msg:"failed to update",
        route:"/update/:id"
     })
   }
   
   }


   export async function deleteMovie(req:Request, res:Response, next:NextFunction) {
    try{ 
       const  {id} = req.params
       const record = await MovieInstance.findOne({where: {id}})
       if(!record){
          return res.status(404).json({
             msg:"Cannot find todo"
          })
       }
       const deletedRecord = await record.destroy()
       return res.status(200).json({
          msg: "Todo deleted successfully",
          deletedRecord 
       })
   }catch(error){
     res.status(500).json({
        msg:"failed to delete",
        route:"/delete/:id"
     })
   }
   
   }
   
   