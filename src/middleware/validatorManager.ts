
import { body, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';

export const validationResultExpress = (
    req: Request,
    res: Response,
    next: NextFunction
  ): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }
    next();
  };

export const bodyRegisterValidator=[
    body("email", "Formator de email incorrecto")
    .trim()
    .isEmail()
    .normalizeEmail(),
    body("password","Minimimo 6 caracteres").trim().isLength({min:6}),
    body("password", "formato de password incorrecto").custom((value, {req})=>{
        if(value !== req.body.repassword){
            throw new Error("Password no coinciden");
        }
        return value;
    }),
    validationResultExpress,
    
];

export const bodyLoginValidator = [
    body("email", "Formato de email incorrecto")
      .trim()
      .isEmail()
      .normalizeEmail(),
    body("password", "Mínimo 6 caracteres")
      .trim()
      .isLength({ min: 6 }),
    validationResultExpress
  ];
  
