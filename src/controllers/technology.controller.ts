import { Request, Response } from "express";
import { Technology } from "../models/Technology";
import { ValidationError } from "sequelize";

export const getAllTechnology = async (req: Request, res: Response) => {
    try {
        const technologies = await Technology.findAll();
        console.log('tecnologias',technologies);
        if(!technologies){
            return res.status(404).json({ error: 'Technologies not found'});
        }
        res.status(200).json(technologies);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error'});        
    }
}
const handleServerError = (res: Response, error: unknown) => {
    console.error(error);
    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors.map(err => err.message)
        });
    }
    return res.status(500).json({ error: 'Internal server error' });
};

export const createTechnology = async (req: Request, res: Response) => {
    try {
        const { nombre, image, categoryId} = req.body;
        if(!nombre ||  !categoryId){
            res.status(400).json({error:'Todos los campos son obligatorios'});
        }
        const technology =await Technology.create({
            nombre, 
            image, 
            categoryId
        });
        res.status(201).json({message:'Tecnologia creada', technology});
    } catch (error) {
        handleServerError(res, error);
    }
}

export const getTechnologyById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const technology = await Technology.findByPk(id);
        if(!technology){
            return res.status(404).json({ error: 'Technology not found'});
        }
        res.status(200).json(technology);
    }catch(error){
        handleServerError(res, error);
    }
}
export const updateTechnology = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const {nombre, image, categoryId}= req.body;

        const technology = await Technology.findByPk(id);
        if(!technology){
            return res.status(404).json({ error: 'Technology not found'});    
        }
        await technology.update({ nombre, image, categoryId});
        res.status(200).json(technology);
    }catch(error){
        handleServerError(res, error);
    }


}

