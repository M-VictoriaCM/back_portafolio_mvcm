import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

interface JwtPayload {
  uid: string
  mfa?: boolean
  mfaVerified?: boolean
}

export const requireMfa = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET!
    ) as JwtPayload

    // 🚫 Token temporal de MFA
    if (payload.mfa) {
      return res.status(403).json({
        error: 'MFA pendiente de verificación'
      })
    }

    // 🔐 MFA requerido pero no verificado
    if (!payload.mfaVerified) {
      return res.status(403).json({
        error: 'Se requiere verificación MFA'
      })
    }

    // ✅ Token final válido
    ;(req as any).userId = payload.uid

    next()
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido o expirado' })
  }
}
