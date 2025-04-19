import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { handleServerError } from "../utils/handleServerError";



export const createCategory = async (req: Request, res: Response) => {
    try {
        const { title, icon } = req.body;
        if (!title || !icon) {
            return res.status(400).json({ error: 'Title and icon are required' });
        }
        const category = await categoryService.createCategory(title, icon);
        res.status(201).json({message:'Categoria creada',category});
    } catch (error) {
        handleServerError(res, error);
    }
}


export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.getAllCategory();
        if (!categories) {
            return res.status(404).json({ error: 'Categories not found' });
        }
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const category = await categoryService.getCategoryById(id);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}
export const updateCategory = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, icon } = req.body;
        const category = await categoryService.updateCategory(id, title, icon);
        if (!category) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}