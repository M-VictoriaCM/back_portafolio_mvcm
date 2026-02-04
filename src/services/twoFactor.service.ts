// src/services/twofactor.service.ts
import { User } from '../models/User';
import { decrypt, encrypt } from '../utils/crypto';
import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

export const generateTOTP = async (user: User) => {
  const secret = speakeasy.generateSecret({
    name: `MiApp (${user.email})`,
  });

  const plainSecret = secret.base32;
  const encryptedSecret = encrypt(plainSecret);

  console.log("------------------------------------------");
  console.log("PRE-GUARDADO:");
  console.log("Plano:", plainSecret);
  console.log("Encriptado:", encryptedSecret);
  console.log("------------------------------------------");

  // FORZAMOS EL UPDATE DIRECTO A LA DB PARA QUE NO HAYA DUDA
  await User.update(
    { totpSecret: encryptedSecret },
    { where: { id: user.id } }
  );

  const qr = await QRCode.toDataURL(secret.otpauth_url!);
  return { qr };
}

// En twofactorService.ts
export const verifyTOTP = (user: User, token: string): boolean => {
  const secret = decrypt(user.totpSecret!) // Aquí recuperamos el secret plano

  return speakeasy.totp.verify({
    secret: secret, // El secret desencriptado
    encoding: 'base32', // IMPORTANTE: debe coincidir con como se generó
    token: token,
    window: 1 // Da un margen de error de 30 segundos antes/después por si hay lag
  })
}