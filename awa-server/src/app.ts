import express from 'express';
import cors, { CorsOptions } from 'cors';
import userRouter from './routes/user_routes';

const app = express();
app.use(express.json());

const corsOptions : CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use('/api/users', userRouter)


export default app;