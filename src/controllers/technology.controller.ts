import { Request, Response } from "express";
import * as technologyService from "../services/technology.service";
import { handleServerError } from "../utils/handleServerError";

export const createTechnology = async (req: Request, res: Response) => {
    try {
        const { nombre, image, categoryId} = req.body;
        if(!nombre ||  !categoryId){
            res.status(400).json({error:'Todos los campos son obligatorios'});
        }
        const technology =await technologyService.createTechnology(nombre, image, categoryId);
        res.status(201).json({message:'Tecnologia creada', technology});
    } catch (error) {
        handleServerError(res, error);
    }
}

export const getAllTechnology = async (req: Request, res: Response) => {
    try {
        const technologies = await technologyService.getAllTechnology();
        if(!technologies){
            return res.status(404).json({ error: 'Technologies not found'});
        }
        res.status(200).json(technologies);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);        
    }
}


export const getTechnologyById = async (req: Request, res: Response) => {
    try{
        const { id } = req.params;
        const technology = await technologyService.getTechnologyById(id);
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

        const technology = await technologyService.updateTechnology(id, nombre, image, categoryId);
        if(!technology){
            return res.status(404).json({ error: 'Technology not found'});    
        }
        res.status(200).json(technology);
    }catch(error){
        handleServerError(res, error);
    }


}

