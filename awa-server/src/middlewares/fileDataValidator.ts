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

const folderValidationRules : ValidationChain[] = [
    body('folderName').trim().escape().notEmpty().withMessage('Folder name should not be empty.'),
  ];

const fileValidationRules : ValidationChain[] = [
    body('fileName').trim().escape().notEmpty().withMessage('File name should not be empty.'),
 ];


const editFolderValidationRules : ValidationChain[] = [
  body('folderName').optional().trim().escape().notEmpty().withMessage('Folder name should not be empty.'),
];

export const validateFolderData = validate(folderValidationRules);
export const validateFileData = validate(fileValidationRules);
export const validateEditFolderData = validate(editFolderValidationRules);