import { Request, Response } from "express";
import { handleServerError } from "../utils/handleServerError";
import { Study } from "../models/Study";

// Crear un nuevo estudio
export const createStudy = async (req: Request, res: Response) => {
    try {
        const{title,institution, startYear, endYear}=req.body;
    } catch (error) {
        
    }
}