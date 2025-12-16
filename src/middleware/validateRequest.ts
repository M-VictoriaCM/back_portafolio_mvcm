import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

/**
 * Middleware para validar requests usando schemas de Zod
 * @param schema Schema de Zod para validar el request
 * @returns Middleware de Express
 * 
 * @example
 * router.post('/', validateRequest(createCategorySchema), createCategory);
 */
export const validateRequest = (schema: z.ZodTypeAny, p0: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar el request completo (params, query, body)
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Formatear errores de Zod para respuesta amigable
        const errors = error.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        return res.status(400).json({
          error: 'Errores de validación',
          details: errors,
        });
      }
      
      // Error no esperado
      return res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  };
};

/**
 * Middleware simplificado para validar solo el body
 * @param schema Schema de Zod para validar el body
 * @returns Middleware de Express
 */
export const validateBody = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.issues.map((issue: z.ZodIssue) => ({
          field: issue.path.join('.'),
          message: issue.message,
        }));
        
        return res.status(400).json({
          error: 'Errores de validación',
          details: errors,
        });
      }
      
      return res.status(500).json({
        error: 'Error interno del servidor',
      });
    }
  };
};
