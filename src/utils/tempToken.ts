import jwt from 'jsonwebtoken';

const TEMP_SECRET = process.env.TEMP_JWT_SECRET!;

export const generateTempToken = (userId: number) =>{
    return jwt.sign(
        { uid: userId, type: '2fa'},
        TEMP_SECRET,
        { expiresIn: '5m' }
    );
}

export const verifyTempToken = (token: string): number => {
  const decoded = jwt.verify(token, TEMP_SECRET) as any

  if (decoded.type !== '2fa') {
    throw new Error('Invalid temp token')
  }

  return decoded.uid
}