import { Request, Response } from "express";
import * as technologyService from "../services/technology.service";
import { handleServerError } from "../utils/handleServerError";

interface updateTechnologyBody{
    nombre: string; 
    image: string;
    categoryId: string;
}

export const createTechnology = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const technology = await technologyService.createTechnology(req.body, userId);
        res.status(201).json({
            message:'Tecnologia creada', 
            technology
        });
    } catch (error) {
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
    try{
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const { nombre, image, categoryId } = req.body as updateTechnologyBody;
        const updateTechnology = await technologyService.updateTechnology(id, nombre, image, categoryId);
        if(!updateTechnology ){
            return res.status(404).json({ error: 'Technology not found'});    
        }
        res.status(200).json({
            message: 'Tecnologia actualizada correctamente',
            technology: updateTechnology
        });
    }catch(error){
        handleServerError(res, error);
    }
}
//Muestro todas las tecnologias ordenadas por id de categoria
export const getAllTechnologyByCategory = async(req: Request, res: Response)=>{
    try {
    const technologies = await technologyService.getAllTechnologyByCategory();
    res.status(200).json({ technologies });
  } catch (error) {
    console.error(error);
    handleServerError(res, error);
  }
}

//Elimino una categoria
export const deleteTechnology = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const deleted = await technologyService.deleteTechnology(id, userId);
        if (!deleted){
            return res.status(404).json({ error: 'Technology not found' });
        }
        res.status(200).json({ message: 'Tecnologia eliminada correctamente' });
    } catch (error) {
        handleServerError(res, error);
    }
};

//Muestro todas las Tecnologias
export const getAllTechnology = async (_req: Request, res: Response)=>{
    try {
        const technologies = await technologyService.getAllTechnology();
        if(!technologies){
            return res.status(404).json({ error: 'Technologies not found'});
        }
        res.status(200).json(technologies);
    } catch (error) {
        handleServerError(res, error);    
    }
};