import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { handleServerError } from "../utils/handleServerError";


interface UpdateCategoryBody {
  title: string;
  icon: string;
}

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }

        const newCategory = await categoryService.createCategory(req.body, userId);
        res.status(201).json({message:'Categoria creada',newCategory});

    } catch (error) {
        handleServerError(res, error);
    }
}

// Obtener todas las categorías
export const getAllCategory = async (_req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategory();
        res.status(200).json({categories});
    } catch (error) {
        handleServerError(res, error);
    }
}

// Obtener una categoría por ID
export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Categoria no encontrada' });
        }
        res.status(200).json(category);
    } catch (error) {
        handleServerError(res, error);
    }
}

//Actualizo una categoría
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }

        const { id } = req.params;
        const { title, icon } = req.body as UpdateCategoryBody;
        
        const updateCategory = await categoryService.updateCategory(id, title, icon, userId);
        if (!updateCategory) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({
            message:"Categoría actualizada correctamente",
            category :updateCategory
        });
    } catch (error) {
        handleServerError(res, error);
    }
}


//Elimino una categoría
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const deleted = await categoryService.deleteCategory(id, userId);
        if (!deleted) {
            return res.status(404).json({ error: 'Categoría no encontrada' });
        }
        res.status(200).json({ message: 'Categoría eliminada correctamente' });
    } catch (error) {
        handleServerError(res, error);
    }
};