import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";
import * as badgeService from "../services/badge.service"

/**
 * Estructura del cuerpo para actualizar insignia
 */
interface updateBadgeBody {
    creadly: string;
};

/**
 * Controlador para crear una nueva insignia
 * @param req 
 * @param res 
 * @returns Nueva insignia creada
 */
export const createBadge = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const newBadge = await badgeService.createBadge(req.body, userId);
        res.status(201).json({
            message:'Insignia creada',
            newBadge
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

/**
 * Controlador para obtener todas las insignias
 * @param _req
 * @param res
 * @returns Todas las insignias
 */
export const getAllBadges = async (_req: Request, res: Response) => {
    try {
        const badges = await badgeService.getAllBadges();
        res.status(200).json({
            message: 'Insignias obtenidas',
            badges
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

/**
 * Controlador para obtener una insignia por ID
 * @param req 
 * @param res 
 * @returns 
 */
export const getBadgeById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const badge = await badgeService.getBadgeById(id);
        if (!badge) {
            return res.status(404).json({ error: 'Insignia no encontrada' });
        }
        res.status(200).json({
            message: 'Insignia obtenida',
            badge
        });
    } catch (error) {
        handleServerError(res, error);
    }
};

/**
 * Controlador para actualizar una insignia
 * @param req 
 * @param res 
 * @returns Insignia actualizada
 */
export const updateBadge = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const { creadly } = req.body as updateBadgeBody;
        const updatedBadge = await badgeService.updateBadge(
            id, 
            creadly, 
            userId
        );
        if (!updatedBadge) {
            return res.status(404).json({ error: 'Insignia no encontrada' });
        }
        res.status(200).json({ 
            message: 'Insignia actualizada', 
            updatedBadge 
        });
    } catch (error) {
        handleServerError(res, error);    
    }
};

/**
 * controlador para eliminar una insignia
 * @param req 
 * @param res 
 * @returns 
 */
export const deleteBadge = async (req: Request, res: Response) => {
    try {
        const userId = req.uid;
        if(!userId){
            return res.status(401).json({error:"No autorizado"});
        }
        const { id } = req.params;
        const deleted = await badgeService.deleteBadge(id, userId);
        if(!deleted){
            return res.status(404).json({error:"Insignia no encontrada"});
        }
        res.status(200).json({
            message:"Insignia eliminada correctamente"
        });
    } catch (error) {
        handleServerError(res, error);
    }
};