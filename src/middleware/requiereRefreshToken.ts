import { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import { tokenVerificationErrors } from "../utils/tokenManager";


export const requireRefreshToken = (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshTokenCookie = req.cookies.refreshToken;
    if (!refreshTokenCookie) {
      throw new Error('No token provided');
    }
    const decoded = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH!) as JwtPayload;
    const uid = decoded.uid as string;
    req.uid = uid;

    next();
  } catch (error) {
    const message = tokenVerificationErrors[(error as Error).message] || "Token inválido";
    res.status(401).send({ error: message });
  }
};
