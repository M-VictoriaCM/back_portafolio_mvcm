import { Request, Response, NextFunction } from 'express'
import { admin } from '../../config/firebase'

export const requireFirebaseAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token Firebase no proporcionado' })
    }

    const token = authHeader.split(' ')[1]

    const decoded = await admin.auth().verifyIdToken(token)

    req.firebaseUser = decoded
    next()
  } catch (error) {
    console.error('❌ Firebase auth error:', error)
    return res.status(401).json({ error: 'Token Firebase inválido' })
  }
}
