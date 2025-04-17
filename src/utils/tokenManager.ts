import  jwt  from "jsonwebtoken";
import { Response } from "express";

export const generateToken = (uid:string)=>{
    const expiresIn = 60 * 15;

    try {
        const token = jwt.sign({uid}, process.env.JWT_SECRET!, {expiresIn});
        return { token, expiresIn};
    } catch (error) {
        console.log(error);
        throw new Error("Error al generar el token");
    }
}
export const generateRefreshToken=(uid:string, res:Response)=>{
    const expiresIn = 60 * 60*24*30;
    try {
        const refreshToken= jwt.sign({uid}, process.env.JWT_REFRESH!, {expiresIn});
        res.cookie("refreshToken", refreshToken,{
            httpOnly:true,
            secure:!(process.env.MODO === "developer"),
            expires : new Date(Date.now() + expiresIn * 1000)
        });
        
    } catch (error) {
        console.log(error);
    }
    

}
export const tokenVerificationErrors: Record<string, string> = {
    "invalid signature": "La firma del token es inválida",
    "jwt expired": "El token ha expirado",
    "invalid token": "El token es inválido",
    "No Bearer": "Utilizar formato Bearer token",
    "jwt malformed": "El token es inválido"
  };
  