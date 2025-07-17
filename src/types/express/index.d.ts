// src/types/express/index.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    uid?: string;       // Para el ID del usuario
    user?: User;        // Para el objeto de usuario completo (opcional)
  }
}