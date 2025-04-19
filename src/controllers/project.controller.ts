import { Request, Response } from "express";
import * as projectService from "../services/project.service";
import { handleServerError } from "../utils/handleServerError";

export const createProject = async (req: Request, res: Response) => {
    try {
        const {title, description, image, repository, userId}=req.body;
        if(!title || !description || !userId){
            return res.status(400).json({ error: 'Todos los campos son obligatorios'});
        }
        const project = await projectService.createProject(title, description, image, repository, userId);
        res.status(201).json({
            message: 'Proyecto creado correctamente',
            project
        });
    } catch (error) {
        handleServerError(res, error);
    }
}
export const getAllProyects =async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProject();
        if(!projects){
            return res.status(404).json({ error: 'Projects not found'});
        }
        res.status(200).json(projects);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const {id } = req.params;
        const project =await projectService.getProjectById(id);
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
        const project=await projectService.updateProject(id, title, description, image, repository, userId);
        if(!project){
            return res.status(404).json({ error: 'Proyecto no encontrado'});
        }
        res.status(200).json({message: 'Proyecto actualizado correctamente', project });
    } catch (error) {
        handleServerError(res, error);
    }
}