import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";


interface JwtPayload {
  uid: string;
  mfaVerified?: boolean;
}

export const requireAuth =(
  req: Request,
  res: Response,
  next: NextFunction
)=>{
  const authHeader = req.headers.authorization;
  
  if(!authHeader || !authHeader.startsWith("Bearer ")){
    return res.status(401).json({error: "Token requerido"});
  }
  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload;

    //UID disponible para controladores
    (req as any).uid = payload.uid;

    //Verificar MFA
    if(!payload.mfaVerified){
      return res.status(401).json({
        error : "MFA requerido"
      });
    }
    next();
  } catch (error: any) {
    console.error("Error detallado en middleware auth", error);
    res.status(401).json({error: "Token inválido"});
  }
};
// export const authRequired = (req: Request, res: Response, next: NextFunction) => {
//   const bearer = req.headers.authorization;

//   if (!bearer) {
//     return res.status(401).json({ error: "Token requerido" });
//   }

//   const token = bearer.split(" ")[1];

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET!) as TokenPayload;

//     req.uid = decoded.uid;

//     next();
//   } catch (error) {
//     return res.status(401).json({ error: "Token inválido" });
//   }
// };
