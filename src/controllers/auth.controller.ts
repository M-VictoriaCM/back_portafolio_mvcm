import { Request, Response } from 'express'
import { auth } from '../../config/firebase'
import * as userService from '../services/auth.service'
import { generateToken, generateRefreshToken } from '../utils/tokenManager'
import { User } from '../models/User'
import jwt from 'jsonwebtoken';

export const registerWithFirebase = async (req: Request, res: Response) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const { uid, email } = req.firebaseUser

    // 1️⃣ ¿Ya existe por firebaseUid?
    let user = await User.findOne({ where: { firebaseUid: uid } })

    if (user) {
      return res.json({
        id: user.id,
        email: user.email,
        mfaSetupRequired: !user.totpEnabled
      })
    }

    // 2️⃣ ¿Existe por email con otro UID?
    const emailUsed = await User.findOne({ where: { email } })

    if (emailUsed) {
      return res.status(409).json({
        error: 'Email ya registrado con otra cuenta'
      })
    }

    // 3️⃣ Crear usuario
    user = await User.create({
      email,
      firebaseUid: uid,
      totpEnabled: false,
      mfaVerified: false
    })

    return res.status(201).json({
      id: user.id,
      email: user.email,
      mfaSetupRequired: !user.totpEnabled
    })
    console.log(user?.email);
  } catch (err) {
    console.error('❌ registerWithFirebase error:', err)
    return res.status(500).json({ error: 'Error registrando usuario' })
  }
}

export const firebaseAuth = async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing Bearer token' })
    }

    const idToken = authHeader.split(' ')[1]

    const decoded = await auth.verifyIdToken(idToken)

    const { uid, email } = decoded

    if (!email) {
      return res.status(400).json({ error: 'Email missing in token' })
    }

    const user = await userService.findOrCreateFromFirebase(uid, email);

    // Si el usuario ya existía por contraseña, vinculamos su UID de Firebase
    // para que la próxima vez entre sin problemas.
    if (!user.firebaseUid) {
      user.firebaseUid = uid;
      await user.save();
    }
    // 🔐 MFA obligatorio
    if (user.totpEnabled) {
      const tempToken = jwt.sign(
        {
          uid: user.firebaseUid,
          mfaVerified: true,            // 👈 flag CLAVE
        },
        process.env.JWT_SECRET!,
        { expiresIn: '5m' }
      )

      return res.status(200).json({
        twoFactorRequired: true,
        tempToken,             // ✅ lo que espera el frontend
      })
    }


    const { token, expiresIn } = generateToken(
      user.id,{
        mfaVerified: !user.totpEnabled
      })
    generateRefreshToken(user.id, res)

    return res.json({
      token,
      expiresIn,
      user,
    })
  } catch (error) {
    console.error('firebaseAuth error:', error)
    return res.status(401).json({ error: 'Invalid Firebase token' })
  }
}

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
 * Controlador para cerrar sesión
 * @param req 
 * @param res 
 */
export const logout = (req:Request, res:Response) => {
  res.clearCookie("refreshToken");
  res.json({ ok: true });
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
