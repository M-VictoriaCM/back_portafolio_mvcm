// crypto.ts
import crypto from 'crypto'; // Tenías un pequeño typo "cryptp"

const ALGO = 'aes-256-cbc';

// Generamos un hash SHA-256 de tu secreto para asegurar 32 bytes exactos
const KEY = crypto
  .createHash('sha256')
  .update(process.env.TOTP_SECRET_KEY!)
  .digest(); 

export const encrypt = (text: string): string => {
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipheriv(ALGO, KEY, iv);
    const encrypted = Buffer.concat([
        cipher.update(text, 'utf8'),
        cipher.final(),
    ])
    return iv.toString('hex') + ':' + encrypted.toString('hex');
};

export const decrypt = (hash: string): string => {
    console.log("Intentando desencriptar:", hash); // Log de seguridad
    
    if (!hash || !hash.includes(':')) {
        throw new Error(`Formato de hash inválido. Recibido: ${hash}`);
    } 
    
    const [ivHex, encryptedHex] = hash.split(':');
    if (!ivHex || !encryptedHex) throw new Error("Formato de hash inválido");

    const iv = Buffer.from(ivHex, 'hex');
    const decipher = crypto.createDecipheriv(ALGO, KEY, iv);

    const decrypted = Buffer.concat([
        decipher.update(Buffer.from(encryptedHex, 'hex')),
        decipher.final(),
    ]);
    return decrypted.toString('utf8');
}