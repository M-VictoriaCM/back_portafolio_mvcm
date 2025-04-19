import { Request, Response, NextFunction } from "express";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { tokenVerificationErrors } from "../utils/tokenManager";
import { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express/AuthenticatedRequest"; 

// Tipo personalizado para el payload
interface MyJwtPayload extends JwtPayload {
    uid: string;
}

export const requireToken =(req:AuthenticatedRequest, res:Response, next:NextFunction)=>{
    try {
        const autHeader =req.headers.authorization;
        if(!autHeader || !autHeader.startsWith('Bearer')){
            return res.status(401).send({error:'Token no proporcionado'});
        }
        const token= autHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as MyJwtPayload;

        if(!decoded.uid){
            return res.status(401).send({error:'Token inváalidoo'});
        }
        const uid = decoded.uid;
        next();
    } catch (error) {
        if(error instanceof TokenExpiredError){
            return res.status(401).send({error:'Token expirado'});
        }
        const message = tokenVerificationErrors[(error as Error).message] || "Token inválido";
        return res.status(401).send({error:message});
    }
}