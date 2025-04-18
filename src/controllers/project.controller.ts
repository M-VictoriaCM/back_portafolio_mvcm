import { Request, Response } from "express";
import { Project } from "../models/Project";
import { handleServerError } from "../utils/handleServerError";

export const getAllProyects =async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll();
        if(!projects){
            return res.status(404).json({ error: 'Projects not found'});
        }
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error'});
    }
}
export const createProject = async (req: Request, res: Response) => {
    try {
        const {title, description, image, repository, userId}=req.body;
        if(!title || !description || !userId){
            return res.status(400).json({ error: 'Todos los campos son obligatorios'});
        }
        const project = await Project.create({
            title,
            description,
            image,
            repository,
            userId
        });
        res.status(201).json({
            message: 'Proyecto creado correctamente',
            project
        });
    } catch (error) {
        handleServerError(res, error);
    }
}

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const project =await Project.findByPk(id);
        if(!project){
            return res.status(404).json({ error: 'Proyecto no encontrado'});
        }
        res.status(200).json(project);
    } catch (error) {
        handleServerError(res, error);
    }
}
export const updateProject = async (req: Request, res: Response) => {
    const {id}=req.params;
    try {
        const {title, description, image, repository, userId}=req.body;
        const project=await Project.findByPk(id);
        if(!project){
            return res.status(404).json({ error: 'Proyecto no encontrado'});
        }
        await project.update({
            title,
            description,
            image,
            repository,
            userId
        });
        res.status(200).json({
            message: 'Proyecto actualizado correctamente',
            project
        });
    } catch (error) {
        handleServerError(res, error);
    }
}