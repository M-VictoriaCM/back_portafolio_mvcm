import { User } from '../models/User';
import { generateToken } from '../utils/tokenManager';
import bcrypt from "bcrypt";


// ⬇️ NUEVAS FUNCIONES PARA FIREBASE AUTH
export const findByFirebaseUid = async (firebaseUid: string) => {
    return await User.findOne({
        where: { firebaseUid }
    });
};

export const findOrCreateFromFirebase = async (
  firebaseUid: string, 
  email: string, 
  username?: string // ← Parámetro opcional
) => {
    console.log("entro a findOrCreateFromFirebase");
    let user = await User.findOne({ where: { firebaseUid } });

    if (!user) {
        user = await User.findOne({ where: { email } });

        if (user) {
            await user.update({ firebaseUid });
            return user;
        }
    }

    if (!user) {
        user = await User.create({
            firebaseUid: firebaseUid,
            email: email,
            username: username || email.split('@')[0], // ← Usa el username si se proporciona
        });
    }

    return user;
};

export const getRefreshToken = (uid:string)=>{
    if(!uid){
        throw new Error("El usuario no existe");
    }
    const token = generateToken(uid);
    const expiresIn = 60 * 60 * 24 * 30; // 30 dias
    return {token, expiresIn};
}

export const resetPassword = async (email: string, oldPassword: string, newPassword: string) => {
    const user = await User.findOne({ where: { email } });
    if (!user) {
        throw new Error("El usuario no existe");
    }
    const validPassword = await bcrypt.compare(oldPassword, user.password || '');
    if(!validPassword) {
        throw new Error("La contraseña es incorrecta");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
}