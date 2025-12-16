import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface TokenPayload {
  uid: string;
}

export const authRequired = (req: Request, res: Response, next: NextFunction) => {
  const bearer = req.headers.authorization;

  if (!bearer) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = bearer.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

    // 👇 ESTA ES LA PARTE CRÍTICA PARA QUE TU BaseController FUNCIONE
    req.uid = decoded.uid;

    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
