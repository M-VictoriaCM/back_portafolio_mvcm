import { Request, Response, NextFunction } from 'express';

/**
 * Sanitiza los objetos del request eliminando claves potencialmente peligrosas
 * (como las que empiezan con $ o contienen .)
 * para prevenir inyección NoSQL.
 */
export const sanitizeRequest = (req: Request, _res: Response, next: NextFunction) => {
  const sanitize = (obj: any): void => {
    if (typeof obj !== 'object' || obj === null) return;

    for (const key of Object.keys(obj)) {
      if (key.startsWith('$') || key.includes('.')) {
        delete obj[key];
      } else {
        sanitize(obj[key]);
      }
    }
  };

  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);

  next();
};
