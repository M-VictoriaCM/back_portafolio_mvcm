import { User } from '../models/User';

declare global {
  namespace Express {
    interface Request {
      uid?: string; // User ID from JWT
      user?: User;   // Full user object (if populated by middleware)
    }
  }
}

export {};
