// src/types/express/index.d.ts
import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  uid: string; 
}
