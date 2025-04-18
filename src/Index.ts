import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import initializeDB from '../config/dbConfig';
import 'reflect-metadata';
import cookieParser from 'cookie-parser';
//rutas
import userRouter from './routes/user.routes';
import categoryRouter from './routes/category.routes';
import technologyRouter from './routes/technology.routes';
import projectRouter from './routes/project.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const whiteList=[process.env.ORIGIN1, process.env.ORIGIN2];

app.use(cors({
    origin:function(origin, callback){
        if(!origin || whiteList.includes(origin)){
            return callback(null, origin);
        }
        return callback(new Error('Not allowed by CORS'));
        }
    
}));

app.use(express.json());
app.use(cookieParser());



// Agrega esta ruta básica
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);
app.use('/api/technologies', technologyRouter);
app.use('/api/projects', projectRouter);

app.get('/', (req, res) => {
    res.send('API corriendo');
});





const main =async()=>{
    try {
        await initializeDB();
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`);
          });
    } catch (error) {
        console.log(error);
    }
};

main();

