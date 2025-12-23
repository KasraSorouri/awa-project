import { Request, Response, NextFunction } from 'express';
import { body, Result, ValidationChain, ValidationError, validationResult } from 'express-validator';

const validate =  (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        await Promise.all(validations.map(validation => validation.run(req)));

        const errors: Result<ValidationError> = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors.array());
          return res.status(400).json({ errors: errors.array() });
        }
        return  next();
    };
};

const registerValidationRules : ValidationChain[] = [
    body('username').trim().escape().notEmpty().isLength({ min: 3, max: 25 }).withMessage('Name is required, length should be between 3 and 25'),
    body('password').trim().escape().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('email').isEmail().optional().withMessage('Invalid email format'),
    body('firstName').optional(),
    body('lastName').optional(),
  ];

export const validateRegisterData = validate(registerValidationRules);