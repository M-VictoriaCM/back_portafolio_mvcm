import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { handleServerError } from "../utils/handleServerError";


interface updateProfileBody {
  username ?: string, 
  fullName ?: string, 
  urlAvatar ?: string, 
  aboutMe ?:string, 
  socialLinks ?:string
}  



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

// user.controller.ts

export const getPublicProfile = async (req: Request, res: Response) => {
  try {
    const { username } = req.params; // ← Recibe username de la URL
    
    if (!username) {
      return res.status(400).json({ error: 'Username requerido' });
    }
    
    const user = await userService.getPublicProfile(username);
    
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
