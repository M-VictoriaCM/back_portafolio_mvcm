import {auth} from '../../config/firebase';
import { User } from '../models/User';
import { CustomError } from '../utils/CustomError';
import { generateToken } from '../utils/tokenManager';
import bcrypt from "bcrypt";

// ⬇️ NUEVAS FUNCIONES PARA FIREBASE AUTH
export const findByFirebaseUid = async (firebaseUid: string) => {
    return await User.findOne({
        where: { firebaseUid }
    });
};

// user.service.ts

// user.service.ts

export const findOrCreateFromFirebase = async (
  firebaseUid: string, 
  email: string, 
  username?: string // ← Parámetro opcional
) => {
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

// export const login = async({email, password}: {email: string, password: string}) => {
//     if(!email || !password){
//         throw new CustomError("Todos los campos son obligatorios", 400)
//     }
//     const user = await User.findOne({where:{email}});
//     if(!user){
//         throw new CustomError("El usuario no existe", 404);
//     }
//     // Verificar la contraseña
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if(!isPasswordValid){
//         throw new Error("La contraseña es incorrecta");
//     }
//     const {token, expiresIn} = generateToken(user.id);
//     return {
//         token, 
//         expiresIn,
//         uid:user.id
//     }
// }

// export const register = async ({email, username, password}: any)=>{
//     if(!email || !username || !password){
//         throw new Error("Todos los campos son obligatorios")
//     }
//     const existinUser = await auth.getUserByEmail(email).catch(()=>null);
//     if(existinUser){
//         throw new Error("El usuario ya existe en Firebase");
//     }
//     const localUser = await User.findOne({where:{email}});
//     if(localUser){
//         throw new Error("El usuario ya existe en la base de datos");
//     }
//     const userRecord = await auth.createUser({ email, password, displayName: username});
    
//     const newUser = await User.create({
//         email: userRecord.email, username: userRecord.displayName,
//         password: password,
//         firebaseUid: userRecord.uid
//     });
//     const token = generateToken(userRecord.uid);
//     const firebaseToken = await auth.createCustomToken(userRecord.uid);
//     return {token, firebaseToken};
// }

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

export const updateProfile = async(
    username:string | null, 
    fullName: string | null, 
    aboutMe:string | null, 
    socialLinks: string[] | null,
    userId: string
) =>{
    const user = await User.findByPk(userId);
    if(!user){  
        return null;
    }
    await user.update({username, fullName, aboutMe, socialLinks});
    return user;

};

export const getProfile = async (userId: string) => {
  const user = await User.findByPk(userId, {
    attributes: [
      "username",
      "fullName",
      "aboutMe",
      "socialLinks",
      "urlAvatar" // si quieres el avatar
    ]
  });

  if (!user) return null;

// Transformar a objeto plano y parsear socialLinks
  return {
    username: user.username,
    fullName: user.fullName,
    aboutMe: user.aboutMe,
    urlAvatar: user.urlAvatar,
    socialLinks: user.socialLinks ? (typeof user.socialLinks === 'string' ? JSON.parse(user.socialLinks) : user.socialLinks) : {}
  };
};


export const updateAvatar = async (userId: string, urlAvatar: string) => {
     try {
    const user = await User.findByPk(userId);

    if (!user) {
      return null;
    }

    user.urlAvatar = urlAvatar; // 🔹 actualiza el campo
    await user.save(); // 🔹 guarda los cambios

    return user;
  } catch (error) {
    console.error("❌ Error al actualizar el avatar:", error);
    throw new Error("No se pudo actualizar el avatar");
  }
}


export const getPublicProfile= async(username: string) =>{
  const user = await User.findOne({
        where: {username},
        attributes:['username', 'fullName', 'aboutMe', 'urlAvatar', 'socialLinks'],
    });
    if(!user){
        return null;
    }
    return {
        username: user.username,
        fullName: user.fullName,
        aboutMe: user.aboutMe,
        urlAvatar: user.urlAvatar,
        socialLinks: user.socialLinks ? 
        (typeof user.socialLinks === 'string' ? JSON.parse(user.socialLinks) : user.socialLinks) : {}
    }
}

