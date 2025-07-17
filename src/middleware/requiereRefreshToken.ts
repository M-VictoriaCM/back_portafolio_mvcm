import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { tokenVerificationErrors } from "../utils/tokenManager";


export const requireRefreshToken = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;

    if (!refreshTokenCookie) {
      console.log('No se encontro el refreshToken en las cookies');
      throw new Error("No existe el token");
    }

    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH!) as JwtPayload;

    if (!decoded?.uid) {
      throw new Error("Payload inválido");
    }

    res.locals.uid = decoded.uid;

    next();
  } catch (error) {
    console.log("Error detallado en middleware refresh", error);
    res.status(401).json({ error: tokenVerificationErrors[(error as Error).message] || "Token inválido" });
  }
};
