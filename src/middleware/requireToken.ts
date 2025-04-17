import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager";
import { JwtPayload } from "jsonwebtoken";

export const requireToken =(req:Request, res:Response, next:NextFunction)=>{
    try {
        const token =req.headers.authorization?.split(' ')[1];
        if(!token){
            throw new Error('No token provided');
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
        const uid = decoded.uid as string;
        req.uid = uid;
        next();
    } catch (error) {
        const message = tokenVerificationErrors[(error as Error).message] || "Token inválido";
        res.status(401).send({ error: message });
    }
}