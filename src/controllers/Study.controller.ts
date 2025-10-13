import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";
import * as studyService from "../services/study.service"

/**
 * Estructura del cuerpo para actualizar estudio
 */
interface updateStudyBody {
    title: string;
    institution: string;
    startYear ?: number;
    endYear ?: number;
}

/**
 * Controlador para crear un nuevo estudio
 * @param req 
 * @param res 
 * @returns Nuevo estudio creado 
 */
export const createStudy = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const newStudy = await studyService.createStudy(req.body, userId);
        res.status(201).json({
            message:'Estudio creado',
            newStudy
        });
    } catch (error) {
        handleServerError(res, error);
    }
}

/**
 * Controlador para obtener todos los estudios
 * @param _req 
 * @param res 
 * @returns Todos los estudios
 */
export const getAllStudies = async (_req: Request, res: Response) => {
    try {
        const studies = await studyService.getAllStudies();
        res.status(200).json({
            message: 'Estudios obtenidos',
            studies});
    } catch (error) {
        handleServerError(res, error);
    }
};

/**
 * Controlador para obtener un estudio por ID
 * @param req
 * @param res 
 * @returns Estudio por ID
 */
export const getStudyById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const study = await studyService.getStudyById(id);
        if (!study) {
            return res.status(404).json({ error: 'Estudio no encontrado' });
        }
        res.status(200).json({
            message: 'Estudio obtenido',
            study});
    } catch (error) {
        handleServerError(res, error);
    }
};


/**
 * Controlador para actualizar un estudio
 * @param req 
 * @param res
 * @returns Estudio actualizado
 */
export const updateStudy = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const { title, institution, startYear, endYear } = req.body as updateStudyBody;
        const updatedStudy = await studyService.updateStudy(
            id, 
            title, 
            institution, 
            startYear ?? null, 
            endYear ?? null, 
            userId
        );
        if (!updatedStudy) {
            return res.status(404).json({ error: 'Estudio no encontrado' });
        }
        res.status(200).json({ 
            message: 'Estudio actualizado', 
            updatedStudy });
    } catch (error) {
        handleServerError(res, error);
    }
};

/**
 * Controlador para eliminar un estudio
 * @param req 
 * @param res 
 * @returns Estudio eliminado
 */
export const deleteStudy = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const deleted = await studyService.deleteStudy(id, userId);
        if(!deleted){
            return res.status(404).json({error:"Estudio no encontrado"});
        }
        res.status(200).json({message:"Estudio eliminado correctamente"});
    } catch (error) {
        handleServerError(res, error);
    }
};