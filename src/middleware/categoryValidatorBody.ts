import { Request, Response, NextFunction } from "express";

/**
 * Middleware para validar el cuerpo de la solicitud al crear o actualizar una categoría
 * @param req - La solicitud HTTP
 * @param res - La respuesta HTTP
 * @param next - La función para pasar al siguiente middleware
 * @returns void o una respuesta de error
 */
export const categoryValidatorBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  if (!req.body.title) {
    return res.status(400).json({ error: "El título es obligatorio" });
  }
  next();
};
