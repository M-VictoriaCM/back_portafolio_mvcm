import { Request, Response, NextFunction } from "express";

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns Validación del cuerpo de la solicitud para estudios
 */
export const studyValidatorBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void | Response => {
  const { title, institution, startYear, endYear } = req.body;

  /* 
   * Validar campos obligatorios
   **/
  if (!title?.trim() || !institution?.trim()) {
    return res.status(400).json({ error: "Título e institución son obligatorios" });
  }

  /**
   * Validar tipo de año (si existen)
   */
  if (startYear && isNaN(Number(startYear))) {
    return res.status(400).json({ error: "El año de inicio debe ser un número válido" });
  }

  if (endYear && isNaN(Number(endYear))) {
    return res.status(400).json({ error: "El año de finalización debe ser un número válido" });
  }

  /*
  * Validar relación entre años
   */
  if (startYear && endYear && Number(endYear) < Number(startYear)) {
    return res.status(400).json({
      error: "El año de finalización no puede ser anterior al año de inicio"
    });
  }
  next();
};
