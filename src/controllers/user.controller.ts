import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { generateRefreshToken, generateToken } from "../utils/tokenManager";
import { User } from "../models/User";
import { CustomError } from "../utils/CustomError";


//login
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


//Registrarse
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

export const infoUser = async (req: Request, res: Response): Promise<Response> => {
  try {
    const uid = res.locals.uid;

    const user = await User.findByPk(uid, {
      attributes:{exclude:["password"]},
      include:["technologies","categories","studies","badges"]
    });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    return res.json({ email: user.email });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error de servidor" });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, expiresIn } = generateToken(res.locals.uid);
    res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "error de server" });
  }
};

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

export const logout = (req:Request, res:Response) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
};


//login-social

export const updateProfile = async(req: Request, res: Response)=>{
  try {
    const uid = res.locals.uid;
    const {name, fullName, urlAvatar, aboutMe, socialLinks} = req.body;

    const user = await userService.updateProfile(name, fullName, urlAvatar, aboutMe, socialLinks); 
    if(!user){
      return res.status(404).json({error:"Usuario no encontrado"});
    }
    user.fullName = fullName ?? user.fullName;
    user.urlAvatar = urlAvatar ?? user.urlAvatar;
    user.aboutMe = aboutMe ?? user.aboutMe;
    user.socialLinks = socialLinks ?? user.socialLinks;
    await user.save();
    res.status(200).json({
            message:"Perfil actualizado correctamente", user
        });
    
  } catch (error) {
    console.error(error);
    return res.status(500).json({error:"Error al actualizar el perfil"});
  }
};