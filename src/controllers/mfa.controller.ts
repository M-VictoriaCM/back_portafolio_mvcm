import { Response, Request } from 'express'
import speakeasy from 'speakeasy'
import QRCode from 'qrcode'
import jwt from 'jsonwebtoken'
import { User } from '../models/User'
import { generateToken, generateRefreshToken } from '../utils/tokenManager'
import { verifyTOTP } from '../services/twoFactor.service'
import { decrypt, encrypt } from '../utils/crypto'
/**
 * POST /mfa/setup
 */
export const setupMfa = async (req: Request, res: Response) => {
  try {
    if (!req.firebaseUser) {
      return res.status(401).json({ error: 'No autenticado' })
    }

    const user = await User.findOne({
      where: { firebaseUid: req.firebaseUser.uid }
    })

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' })
    }

    if (user.totpEnabled) {
      return res.status(400).json({ error: 'MFA ya habilitado' })
    }

    const secret = speakeasy.generateSecret({
      name: `Portafolio (${user.email})`
    })

    user.totpSecret =encrypt(secret.base32)
    await user.save()

    const qr = await QRCode.toDataURL(secret.otpauth_url!)

    return res.json({ qr })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Error configurando MFA' })
  }
}

/**
 * POST /mfa/confirm
 */
export const confirmMfa = async (req: Request, res: Response) => {
  try {
    const { token } = req.body
    
    // Log para debug
    console.log("Intentando confirmar MFA para:", req.firebaseUser?.uid);

    if (!req.firebaseUser || !token) {
      return res.status(401).json({ error: 'No autenticado o token ausente' })
    }

    const user = await User.findOne({
      where: { firebaseUid: req.firebaseUser.uid }
    })
    console.log("VALOR EN DB", user?.totpSecret)

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado en DB' })
    }

    if (!user.totpSecret) {
      return res.status(400).json({ error: 'MFA no inicializado (secret faltante)' })
    }
    if(!user || !user.totpSecret){
      return res.status(404).json({ error: 'Usuario inválido' })
    }

    // Asegúrate de que verifyTOTP reciba el secret, no solo el objeto user
    const valid = verifyTOTP(user, token) 

    if (!valid) {
      return res.status(400).json({ error: 'Código inválido' })
    }

    user.totpEnabled = true
    user.mfaVerified = true
    await user.save()

    // Revisa si generateToken o generateRefreshToken existen y están importadas
    const { token: authToken, expiresIn } = generateToken(user.id, {
      mfaVerified: true
    })

    generateRefreshToken(user.id, res)

    return res.json({
      success: true,
      token: authToken,
      expiresIn
    })
  } catch (err: any) {
    // ESTO MOSTRARÁ EL ERROR REAL EN TU CONSOLA DE NODE
    console.error("🔥 Error real en confirmMfa:", err.message);
    console.error(err.stack); 
    
    return res.status(500).json({ 
      error: 'Error confirmando MFA',
      details: err.message // Solo para desarrollo
    })
  }
}

export const verifyMfa = async (req: Request, res: Response) => {
  console.log("!!! HE LLEGADO A VERIFY !!!"); // 👈 Si esto no sale en Node, no llega la petición.
  console.log("BODY RECIBIDO:", req.body); 
  try { 
    const { token, tempToken } = req.body 
    if (!token || !tempToken) { 
      return res.status(400).json({ error: 'Datos incompletos' }) 
    } 
    // 🔓 Verificar tempToken MFA 
    const payload = jwt.verify(tempToken, process.env.JWT_SECRET!) as { uid: string; mfa: boolean }
    // 🔍 Buscar usuario 
    
    const user = await User.findOne({ 
      where: { firebaseUid: payload.uid } 
    })
      if (!user || !user.totpEnabled || !user.totpSecret) { 
        return res.status(401).json({ 
          error: '2FA no configurado' 
        }) 
      } 
    // ⏱️ Verificar código TOTP 
    const verified = speakeasy.totp.verify({ 
      secret: decrypt(user.totpSecret), 
      encoding: 'base32', 
      token, 
      window: 1 }
    ) 
    
   if (!verified) {
      console.log("❌ PIN incorrecto");
      return res.status(401).json({ error: 'Código inválido' });
    }

    console.log("✅ PIN correcto, generando token final...");

    const { token: authToken, expiresIn } = generateToken(user.id, { mfaVerified: true });
    generateRefreshToken(user.id, res);

    // 🚨 MUY IMPORTANTE: Asegúrate de enviar esta respuesta
    return res.status(200).json({ 
      token: authToken, 
      expiresIn, 
      user: { id: user.id, email: user.email } 
    });
        
  } catch (error) { 
    console.error(error) 
    return res.status(401).json({ error: 'Token inválido o expirado' }) 
  } 
}

export const disableMfa = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id

    if (!userId) {
      return res.status(401).json({ message: 'No autenticado' })
    }

    const user = await User.findByPk(userId)

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' })
    }

    if (!user.totpEnabled) {
      return res.status(400).json({ message: 'MFA ya está desactivado' })
    }

    // 🔥 Desactivar MFA
    user.totpEnabled = false;
    user.totpSecret = undefined;
    await user.save()

    return res.json({
      success: true,
      message: 'MFA desactivado correctamente'
    })
  } catch (error) {
    console.error('❌ Error desactivando MFA:', error)
    return res.status(500).json({ message: 'Error desactivando MFA' })
  }
}

export const getMfaStatus = async (req: Request, res: Response) => {
  const userId = req.user?.id

  if (!userId) {
    return res.status(401).json({ message: 'No autenticado' })
  }

  const user = await User.findByPk(userId)

  if (!user) {
    return res.status(404).json({ message: 'Usuario no encontrado' })
  }

  return res.json({
    enabled: user.totpEnabled
  })
}