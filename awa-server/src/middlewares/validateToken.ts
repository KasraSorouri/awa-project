import { Request, Response, NextFunction } from "express";
import jwt, {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface CustomRequest extends Request {
    user?: JwtPayload;
}

export const validateToken = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token: string | undefined =  authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Token not found.' });
    }
    try {
        const secretKey : string = process.env.SECRET  as string || 'secret*secret*secret';
        const verify: JwtPayload = jwt.verify(token, secretKey) as JwtPayload;
        req.user = verify;
        next();
        return
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

export const validateLink = (link: string) => {
    try {
        const secretKey : string = process.env.SECRET  as string || 'secret*secret*secret';
        const decodedLink: string = jwt.verify(link, process.env.SECRET as string) as string;
        return decodedLink;
    } catch (error) {
        return false;
    }    
}
