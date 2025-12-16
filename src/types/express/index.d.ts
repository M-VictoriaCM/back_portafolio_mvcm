// src/types/express/index.d.ts
import { Request } from 'express';

declare module 'express' {
  export interface Request {
    user?: User;        // Para el objeto de usuario completo (opcional)
  }
}

declare namespace Express {
  export interface Request {
    uid?: string;
  }
}
