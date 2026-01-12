import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager";

// Tipo personalizado para el payload
interface JwtPayloadWithUid extends jwt.JwtPayload {
  uid: string;
}

export const requireToken = (req: Request, res: Response, next: NextFunction):void => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Formato de token inválido' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayloadWithUid;

    if (!decoded.uid) {
      res.status(401).json({ error: 'Token inválido' });
      return;
    }

    req.uid = decoded.uid; // TypeScript ahora lo aceptará
    next();
  } catch (error) {
    // Manejo de errores existente
    if (error instanceof TokenExpiredError) {
      res.status(401).json({ error: 'El token ha expirado' });
    }else{
      res.status(401).json({ error: tokenVerificationErrors[(error as Error).message as keyof typeof tokenVerificationErrors] || 'Token inválido' });
    }
  }
};