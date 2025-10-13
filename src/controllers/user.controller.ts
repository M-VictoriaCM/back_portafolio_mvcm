import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateRefreshToken, generateToken } from "../utils/tokenManager";
import { User } from "../models/User";
import { CustomError } from "../utils/CustomError";
import { handleServerError } from "../utils/handleServerError";

interface updateProfileBody {
  username ?: string, 
  fullName ?: string, 
  urlAvatar ?: string, 
  aboutMe ?:string, 
  socialLinks ?:string
}  

/**
 * Iniciar sesión
 * @param req 
 * @param res 
 * @return void
 */
export const login = async (req: Request, res: Response) => {
  try {

    const { token, expiresIn, uid } = await userService.login(req.body);

    generateRefreshToken(uid, res);
    res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.error(error);
    const status = error instanceof CustomError ? error.statusCode : 400;
    res.status(status).json({ error: error instanceof Error ? error.message : "Error al iniciar sesión" })
  }
}

/**
 * Controlador de registro
 * @param req 
 * @param res 
 * @return void
 */
export const register = async (req: Request, res: Response) => {
  try {
    const result = await userService.register(req.body);
    res.cookie("token", result.token, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"),
    });
    res.status(201).json(result);
  } catch (error) {
    console.error("❌Erro en registro:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/*
* Controlador para refrescar el token
*/
export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, expiresIn } = generateToken(res.locals.uid);
    res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error de server" });
  }
};

/**
 * Controlador para resetear la contraseña
 * @param req 
 * @param res 
 * @return void
 */
export const resetPassword = async (req: Request, res: Response) => {

  try {
    const { email, oldPassword, newPassword } = req.body;
    if (!email || !oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }
    if (oldPassword === newPassword) {
      return res.status(400).json({ error: 'Las contraseñas no pueden ser iguales' });
    }
    await userService.resetPassword(email, oldPassword, newPassword);

    res.status(200).json({
      message: 'Contraseña actualizada correctamente'
    });

  } catch (error: any) {
    console.error(error);
    if (error.message === "Usuario no encontrado") {
      return res.status(404).json({ error: error.message });
    }
    if (error.message === "Contraseña incorrecta") {
      return res.status(401).json({ error: error.message });
    }
    res.status(500).json({ error: "Internal server error" });
  }
}

/**
 * Controlador para cerrar sesión
 * @param req 
 * @param res 
 */
export const logout = (req:Request, res:Response) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};


//login-social

/**
 * Controlador para actualizar el perfil del usuario
 * @param req 
 * @param res 
 */
export const updateProfile = async(req: Request, res: Response)=>{
  try {
    const userId = req.uid;
    if(!userId){
      return res.status(401).json({error:"No autorizado"});
    }
    const {username, fullName, aboutMe, socialLinks} = req.body as updateProfileBody;

     const parsedLinks = socialLinks ? JSON.parse(socialLinks) : null;

    const updateUser = await userService.updateProfile(
      username ?? null, 
      fullName ?? null,
      aboutMe ?? null, 
      parsedLinks,
      userId 
    ); 
    if(!updateUser){
      return res.status(404).json({error:"Usuario no encontrado"});
    }
   res.status(200).json({
    message:"Perfil actualizado correctamente",
    updateUser
  });
    
  } catch (error) {
    handleServerError(res, error);
  }
};

/**
 * Controlador para mostrar los datos del usuario
 * @param req 
 * @param res 
 */
export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) return res.status(401).json({ error: "No autorizado" });

    const user = await userService.getProfile(userId);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    res.status(200).json({
      message: "Perfil obtenido correctamente",
      user
    });
  } catch (error) {
    handleServerError(res, error);
  }
};

/**
 * Controlador para actualizar el perfil
 * @param req 
 * @param res 
 */
export const updateAvatar = async (req: Request, res: Response) => {
  try {
    const userId = req.uid;
    if (!userId) {
      return res.status(401).json({ error: "No autorizado" });
    }
    const {urlAvatar} = req.body;
    
    const user = await userService.updateAvatar(userId, urlAvatar);
    if(!user ){
      return res.status(404).json({ error: 'Avatar not found'});    
    }
    res.status(200).json({
      message: 'Avatar actualizado correctamente',
      user});
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
   
    const user = await userService.getPublicProfile();
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    res.status(200).json({
      message: 'Perfil obtenido correctamente',
      user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};