import { Request, Response } from "express";
import { Category } from "../models/Category";
import { ValidationError } from "sequelize";


export const createCategory = async (req: Request, res: Response) => {
    
    try {
        const { title, icon } = req.body;
        if(!title || !icon){
            return res.status(400).json({ error: 'Title and icon are required'});
        }
        const category =await Category.create({title, icon});
        res.status(201).json(category);

    } catch (error) {
        console.log(error);
        if(error instanceof ValidationError){
            return res.status(400).json({
                message: "Validation error",
                errors: error.errors.map(err => err.message)
            });
        }
        res.status(500).json({ error: 'Internal server error'});
        
    }
}


export const getAllCategory = async (req: Request, res: Response) => {
    try {
        const categories = await Category.findAll();
        if(!categories){
            return res.status(404).json({ error: 'Categories not found'});
        }
        res.status(200).json(categories);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error'});
    
    }
}

export const getCategoryById = async (req: Request, res: Response)=>{
    try{
        const { id } = req.params;
        const category = await Category.findByPk(id);
        if(!category){
            return res.status(404).json({ error: 'Category not found'});
        }
        res.status(200).json(category);
    }catch(error){
        res.status(500).json({ error: 'Internal server error'});
    }
}
export const updateCategory = async (req: Request, res: Response)=>{
    try {
        const { id } = req.params;
        const { title, icon } = req.body;
        const category = await Category.findByPk(id);
        if(!category){
            return res.status(404).json({ error: 'Category not found'});
        }
        await category.update({ title, icon });
        res.status(200).json(category);

    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    }
}