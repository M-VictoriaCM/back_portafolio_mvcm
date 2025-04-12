import { Dialect } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

interface DBConfig{
    database: string;
    username: string;
    password:string;
    host:string;
    dialect:Dialect;
    models?:any[];
}

export const config:{db: DBConfig} = {
    db:{
        database:process.env.DB_DATABASE || 'db_portafolio',
        username: process.env.DB_USERNAME || 'root',
        password: process.env.DB_PASSWORD || '',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'mysql'
        
        
    }
}