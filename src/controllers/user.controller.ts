import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { AuthenticatedRequest } from "../types/express/AuthenticatedRequest";


//login
export const login = async (req: Request, res: Response) => {
  try {

    const { token, expiresIn } = await userService.login(req.body);

    res.cookie("token", token, {
      httpOnly: true,
      secure: !(process.env.MODO === "developer"),
    });
    res.status(200).json({ token, expiresIn });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: "Error al iniciar sesión" });
  }
}


//Registrarse
export const register = async (req: AuthenticatedRequest, res: Response) => {
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

export const infoUser = async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.uid) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const userData = await userService.getUserInfo(req.uid);
    return res.json(userData);

  } catch (error) {
    return res.status(500).json({ error: 'Internal server error' });
  }
}

export const refreshToken = (req: AuthenticatedRequest, res: Response) => {
  try {
    const result = userService.getRefreshToken(req.uid);
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
export const logout = (req: Request, res: Response) => {
  res.clearCookie('refreshToken');
  res.json({ message: 'Logout successful' });

}
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



//login-social