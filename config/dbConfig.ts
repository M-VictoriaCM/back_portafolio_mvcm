import { Sequelize } from "sequelize-typescript";
import { config } from "./config";
import path from "path";


export const sequelize = new Sequelize({
    database: config.db.database,
    username: config.db.username,
    password: config.db.password,
    host: config.db.host,
    dialect: config.db.dialect,
    models: [path.resolve(__dirname, "../src/models")], // 👈 Esto escanea todos los modelos
});

const initializeDB = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        await sequelize.sync({ force: false });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
};

export default initializeDB;
    
