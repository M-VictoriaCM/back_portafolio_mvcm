import {auth} from '../../config/firebase';
import { User } from '../models/User';
import { generateToken } from '../utils/tokenManager';
import bcrypt from "bcrypt";


export const login = async({email, password}: {email: string, password: string}) => {
    if(!email || !password){
        throw new Error("Todos los campos son obligatorios")
    }
    const user = await User.findOne({where:{email}});
    if(!user){
        throw new Error("El usuario no existe")
    }
    const {token, expiresIn} = generateToken(user.id);
    return {token, expiresIn}
}

export const register = async ({email, name, password}: any)=>{
    if(!email || !name || !password){
        throw new Error("Todos los campos son obligatorios")
    }
    const existinUser = await auth.getUserByEmail(email).catch(()=>null);
    if(existinUser){
        throw new Error("El usuario ya existe en Firebase");
    }
    const localUser = await User.findOne({where:{email}});
    if(localUser){
        throw new Error("El usuario ya existe en la base de datos");
    }
    const userRecord = await auth.createUser({ email, password, displayName: name});
    
    const newUser = await User.create({
        email: userRecord.email, name: userRecord.displayName,
        password: password,
        firebaseUid: userRecord.uid
    });
    const token = generateToken(userRecord.uid);
    const firebaseToken = await auth.createCustomToken(userRecord.uid);
    return {token, firebaseToken};
}

export const getUserInfo = async (uid: string) => {
    const user = await User.findByPk(uid);
    if(!user){
        throw new Error("El usuario no existe")
    }
    return{
        email:user.email,
        name: user.name,
    };
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
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if(!validPassword) {
        throw new Error("La contraseña es incorrecta");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
}