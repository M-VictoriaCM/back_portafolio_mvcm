
import { body, param, validationResult } from 'express-validator';
import { Response, NextFunction, Request } from 'express';

/**
 * 
 * @param req 
 * @param res 
 * @param next 
 * @returns void
 */
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

/**
 * Validadores para el registro y login de usuarios, links y parámetros
 */
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

/**
 * Validadores para el login de usuarios
 */
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

/**
 * Validadores para los links y parámetros
 */
export const bodyLinkValidator=[
  body("repository", "Formato de link incorrecto")
  .optional()
    .trim()
    .isURL().withMessage("Formato de link incorrecto"),
  validationResultExpress
];

/**
 * Validador para parámetros
 */
export const paramlinkValidator =[
  param("id")
    .trim()
    .notEmpty().withMessage("El parámetro id es obligatorio")
    .isUUID(4).withMessage("Formato de UUID no válido")
    .escape(),
  validationResultExpress,
];