import { Response } from 'express'
import { AuthRequest } from '../middleware/requireFibaseAuth';
import { User } from '../models/User'
import { generateTOTP, verifyTOTP } from '../services/twoFactor.service'
import { generateToken, generateRefreshToken } from '../utils/tokenManager';

 
export const setup2FA = async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔐 Iniciando configuración 2FA...');
    console.log('Usuario de Firebase:', req.firebaseUser?.uid);
    
    if (!req.firebaseUser) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const user = await User.findOne({
      where: { firebaseUid: req.firebaseUser.uid },
    });

    console.log('Usuario encontrado en DB:', user?.id);

    if (!user) {
      console.log('❌ Usuario no encontrado en DB');
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('📱 Generando QR para 2FA...');
    const data = await generateTOTP(user);
    
    console.log('✅ QR generado exitosamente');
    
    return res.json(data);
  } catch (error: any) {
    console.error('❌ Error en setup2FA:', error);
    return res.status(500).json({ error: 'Error al configurar 2FA' });
  }
};

export const confirm2FA = async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔐 Confirmando 2FA...');
    
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ error: 'Código no proporcionado' });
    }

    if (!req.firebaseUser) {
      return res.status(401).json({ error: 'No autenticado' });
    }

    const user = await User.findOne({
      where: { firebaseUid: req.firebaseUser.uid },
    });

    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    console.log('🔍 Verificando código TOTP...');
    
    if (!verifyTOTP(user, token)) {
      console.log('❌ Código inválido');
      return res.status(400).json({ error: 'Código inválido' });
    }

    console.log('✅ Código válido, activando 2FA...');

    user.totpEnabled = true;
    await user.save();

    console.log('✅ 2FA activado para usuario:', user.id);

    // Generar JWT final
    const { token: authToken, expiresIn } = generateToken(user.id, {
      mfaVerified: true
    });
    
    generateRefreshToken(user.id, res);

    return res.json({
      success: true,
      token: authToken,
      expiresIn,
      user: {
        id: user.id,
        email: user.email,
        username: user.username
      }
    });
  } catch (error: any) {
    console.error('❌ Error en confirm2FA:', error);
    return res.status(500).json({ error: 'Error al confirmar 2FA' });
  }
};




