import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateRefreshToken, generateToken } from "../utils/tokenManager";
import { User } from "../models/User";
import { CustomError } from "../utils/CustomError";
import { handleServerError } from "../utils/handleServerError";
import {auth} from '../../config/firebase';


interface updateProfileBody {
  username ?: string, 
  fullName ?: string, 
  urlAvatar ?: string, 
  aboutMe ?:string, 
  socialLinks ?:string
}  
/**
 * Controlador para autenticación con Firebase
 * @param req 
 * @param res 
 */
export const firebaseAuth = async (req: Request, res: Response) => {
  try {
    console.log('🔑 Iniciando autenticación Firebase...');

    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      return res.status(401).json({
        error: 'Formato de token inválido. Usa: Bearer [token]'
      });
    }

    const idToken = authHeader.split(' ')[1];

    if (!idToken) {
      return res.status(401).json({
        error: 'Token no proporcionado'
      });
    }

    // Verificar token con Firebase
    console.log('🔍 Verificando token con Firebase...');
    const decoded = await auth.verifyIdToken(idToken);

    console.log('✅ Token verificado correctamente');
    const { uid, email } = decoded;

    if (!email) {
      return res.status(400).json({
        error: 'El token no contiene email'
      });
    }

    // Buscar o crear usuario en MySQL
    console.log('🔍 Buscando/creando usuario en MySQL...');
    const user = await userService.findOrCreateFromFirebase(uid, email);

    console.log('✅ Usuario obtenido con ID:', user.id);

    // Generar TUS tokens usando el ID de MySQL
    const { token, expiresIn } = generateToken(user.id);
    generateRefreshToken(user.id, res);

    console.log('✅ Autenticación exitosa para:', email);

    return res.status(200).json({
      token,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        urlAvatar: user.urlAvatar
      }
    });

  } catch (error) {
    console.error("❌ Error en firebaseAuth:", error);

    if (error instanceof Error) {
      if (error.message.includes('expired')) {
        return res.status(401).json({
          error: 'Token expirado'
        });
      }
      if (error.message.includes('invalid')) {
        return res.status(401).json({
          error: 'Token inválido'
        });
      }
    }

    return res.status(500).json({
      error: 'Error al autenticar usuario'
    });
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
