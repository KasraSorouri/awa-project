import dotenv from 'dotenv';


dotenv.config();

const PORT: string  = process.env.PORT || '3000';

const DATABASE_URL: string = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432';

const DATABASE_NAME: string = process.env.DATABASE_NAME || 'awa';

const SECRET: string = process.env.SECRET || 'secret*secret*secret';

const STORAGE_DIR: string = process.env.STORAGE_DIR || 'storage';

const FRONTEND_URL: string = process.env.FRONTEND_URL || 'http://localhost:5173';

const SERVER_URL: string = process.env.SERVER_URL || 'localhost:3000/api';

export { PORT, DATABASE_URL, DATABASE_NAME, SECRET, STORAGE_DIR, FRONTEND_URL, SERVER_URL };