
import { Response } from 'express';
import { ValidationError } from "sequelize";

export const handleServerError = (res: Response, error: unknown) => {
    console.error(error);
    if (error instanceof ValidationError) {
        return res.status(400).json({
            message: "Validation error",
            errors: error.errors.map(err => err.message)
        });
    }
    return res.status(500).json({ error: 'Internal server error' });
};