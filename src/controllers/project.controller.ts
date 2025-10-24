import { Request, Response } from "express";
import * as projectService from "../services/project.service";
import { handleServerError } from "../utils/handleServerError";

interface updateProjectBody{
    title: string; 
    description: string;
    image: string;
    repository: string;
    urlDemo?: string;
}
/**
 * Create a new project
 * @param req 
 * @param res message and created project 
 */
export const createProject = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const project = await projectService.createProject(req.body.title, userId);
        res.status(201).json({
            message:'Proyecto creado', 
            project});
    } catch (error) {
        handleServerError(res, error);
    }
}
/**
 * Muestra todos los proyectos
 * @param req, solicitud HTTP
 * @param res, respuesta HTTP
 */
export const getAllProject = async (req: Request, res: Response) => {
    try {
        const projects = await projectService.getAllProject();
        res.status(200).json({projects});
    } catch (error) {
        console.log(error);
        handleServerError(res, error);        
    }
}
/**
 * Muestra un proyecto por su ID
 * @param req, solicitud HTTP
 * @param res, respuesta HTTP
 * @returns proyecto encontrado o null
 */
export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const project = await projectService.getProjectById(id);
        if(!project){
            return res.status(404).json({ error: 'Project not found'});
        }
        res.status(200).json(project);
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}

export const updateProject = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const { title, description, image, repository, urlDemo } = req.body as updateProjectBody;
        const updatedProject = await projectService.updateProject(id, title, description, image, repository, urlDemo || '', userId);
        if(!updatedProject){
            return res.status(404).json({ error: 'Project not found'});
        }
        res.status(200).json({
            message: 'Proyecto actualizado correctamente',
            project: updatedProject
        });
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const deleted = await projectService.deleteProject(id, userId);
        if(!deleted){
            return res.status(404).json({ error: 'Project not found'});
        }
        res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
        console.log(error);
        handleServerError(res, error);
    }
}
