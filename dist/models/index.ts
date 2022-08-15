import { Interface } from 'readline';
import {DataTypes, Model } from 'sequelize';
import db from "../config/database.config"
import {v4 as uuid} from "uuid"

interface MovieAttributes{
    id:string;
    title: string;
    description :string;
    image: string;
    price: number;
    completed: boolean
}

export class MovieInstance extends Model<MovieAttributes>{}

MovieInstance.init({
    id:{type: DataTypes.UUIDV4,primaryKey:true, allowNull:false},

    title:{type:DataTypes.STRING, allowNull:false},

    description: {type:DataTypes.STRING, allowNull:false},

    image: {type: DataTypes.STRING, allowNull:false},

    price:{type: DataTypes.NUMBER, allowNull:false},

    completed:{type:DataTypes.BOOLEAN, allowNull:false}
},{
    sequelize:db,
    tableName:"tlmovies"
}

)
