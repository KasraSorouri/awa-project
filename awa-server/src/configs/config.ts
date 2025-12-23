import dotenv from 'dotenv';


dotenv.config();

const PORT : string  = process.env.PORT || '3000';

const DATABASE_URL : string = process.env.DATABASE_URL || '';

const SECRET : string = process.env.SECRET || 'secret*secret*secret';

export { PORT, DATABASE_URL, SECRET };