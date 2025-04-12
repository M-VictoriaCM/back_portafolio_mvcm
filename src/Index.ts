import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import initializeDB from '../config/dbConfig';
import 'reflect-metadata';
import userRouter from './routes/user.routes';
import categoryRouter from './routes/category.routes';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// Agrega esta ruta básica
app.use('/api/users', userRouter);
app.use('/api/categories', categoryRouter);


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

