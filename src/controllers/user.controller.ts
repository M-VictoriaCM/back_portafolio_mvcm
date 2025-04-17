import { Request, Response } from "express";
import { User } from "../models/User";
import { auth } from "../../config/firebase";
import { generateToken } from "../utils/tokenManager";
import bcrypt from "bcrypt";

//login
export const login = async (req: Request, res: Response) => {
    try {
        console.log("Login ruta alcanzada");  // Agregar un log para verificar
        const { email, password } = req.body;
        if (!email || !password) {
          return res.status(400).json({ error: "Todos los campos son obligatorios" });
        }
    
        const user = await User.findOne({ where: { email } });
    
        if (!user) {
          return res.status(400).json({ error: "El usuario no existe" });
        }
    
        const { token, expiresIn } = generateToken(user.id);
    
        res.cookie("token", token, {
          httpOnly: true,
          secure: !(process.env.MODO === "developer"),
        });
    
        res.status(200).json({ token, expiresIn });
      } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error al iniciar sesión" });
      }
}
  
        
//Registrarse
export const register = async (req: Request, res: Response) => {
    const { email, name, password } = req.body;
  
    try {
      console.log("🟢 Entrando al controlador de register");
  
      // Verificar si los campos son vacíos
      if (!email || !name || !password) {
        console.log("🔴 Faltan campos obligatorios");
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
      }
  
      // Verificar si el usuario existe en Firebase
      const existingUser = await auth.getUserByEmail(email).catch(() => null);
      if (existingUser) {
        console.log("🔴 Usuario ya existe en Firebase");
        return res.status(400).json({ error: 'El usuario ya existe en Firebase' });
      }
  
      // Verificar si el usuario existe en la base de datos local
      const localUser = await User.findOne({ where: { email } });
      if (localUser) {
        console.log("🔴 Usuario ya existe en la base de datos local");
        return res.status(400).json({ error: 'El usuario ya existe en la base de datos local' });
      }
  
      // Crear el usuario en Firebase
      console.log("🟢 Creando usuario en Firebase...");
      const userRecord = await auth.createUser({
        email,
        password,
        displayName: name,
      });
  
      // Crear un objeto de usuario para guardar en la base de datos local
      const newUser = await User.create({
        email: userRecord.email,
        name: userRecord.displayName,
        password: password, // Aquí es donde el modelo de Sequelize se encargará de hacer el hash automáticamente
        firebaseUid: userRecord.uid, // Almacenar el UID de Firebase para referencia
      });
  
      // Generar el token
      const token = generateToken(userRecord.uid);
      const firebaseToken = await auth.createCustomToken(userRecord.uid);
  
      // Guardar el token en las cookies
      res.cookie("token", token, {
        httpOnly: true,
        secure: !(process.env.MODO === "developer"),
      });
  
      // Respuesta exitosa
      console.log("🟢 Registro exitoso");
      res.status(201).json({ token, firebaseToken });
  
    } catch (error: any) {
      console.error("❌ Error en register:", error.message);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
export const infoUser =async(req:Request, res:Response)=>{
    try {
        const user = await User.findByPk(req.uid);
        return res.json({email: user?.email, name: user?.name});
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error'});
    }
}

export const refreshToken=(req:Request, res:Response)=>{
    try {
        if(!req.uid){
            return res.status(401).json({ error: 'Unauthorized'});
        }
        const {token, expiresIn}= generateToken(req.uid);
        res.status(200).json({token, expiresIn});
    
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: 'Internal server error'});
    }
}
export const logout=(req:Request, res:Response)=>{
    res.clearCookie('refreshToken');
    res.json({message:'Logout successful'});

}
export const resetPassword = async (req: Request, res: Response) => {
    
    try {
      const {email, oldPassword, newPassword} = req.body;
      console.log(email, oldPassword, newPassword);
        if(!email || !oldPassword || !newPassword){
          
            return res.status(400).json({ error: 'Todos los campos son obligatorios'});
        }
        if(oldPassword=== newPassword){
            return res.status(400).json({ error: 'Las contraseñas no pueden ser iguales'});
        }
        const user =await User.findOne({where:{email}});
        if(!user){
          return res.status(404).json({
            message: 'Usuario no encontrado'
          
          });
        }
        const validPassword = await  bcrypt.compare(oldPassword, user.password);
        if(!validPassword){
          return res.status(401).json({
            message: 'Contraseña incorrecta'
          });
        }
        user.password= newPassword;
        await user.save();
        
        res.status(200).json({
          message: 'Contraseña actualizada correctamente'
        });

    } catch (error) {
        res.status(500).json({ error: 'Internal server error'});
    
    }
}

//login-social