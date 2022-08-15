import { DataTypes, Model } from "sequelize";
import db from '../config/database.config'
import { MovieInstance } from "./index";

interface UsersAttributes {
  id: string;
  fullname:string;
  username:string
  email:string;
  password:string
}
 
export class UserInstance extends Model<UsersAttributes> {}

UserInstance.init({
  id: {
    type:DataTypes.UUIDV4, 
    primaryKey:true,
    allowNull:false
  }, 
  fullname:{
     type:DataTypes.STRING,
     allowNull:false,
     validate:{
         notNull:{
             msg:'first name is required'
         },
         notEmpty:{
             msg:'Please provide a first name'
         }
     }
  },
  username:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notNull:{
            msg:'phone number is required'
        },
        notEmpty:{
            msg:'Please provide a valid phone number'
        }
    } 
  },
  
  email:{
    type:DataTypes.STRING,
    allowNull:false,
    unique:true,
    validate:{
        notNull:{
            msg:'email is required'
        },
        isEmail:{
            msg:'Please provide a a valid Email'
        }
    }
  },
  
  password:{
    type:DataTypes.STRING,
    allowNull:false,
    validate:{
        notNull:{
            msg:'password is required'
        },
        notEmpty:{
            msg:'Please provide a password'
        }
    }
  }
},{
    sequelize:db,
    tableName:'user'
});

UserInstance.hasMany(MovieInstance, {foreignKey:'userId',
as:'tlmovies'
})

MovieInstance.belongsTo(UserInstance,{foreignKey:'userId',
as:'user'}) 
