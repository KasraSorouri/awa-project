import express from 'express';
import cors, { CorsOptions } from 'cors';
import userRouter from './routes/user_routes';
import folderRouter from './routes/folder_routes';
import fileRouter from './routes/file_router';
import externalShare from './routes/external_share_routes';

const app = express();
app.use(express.json());

const corsOptions : CorsOptions = {
  origin: '*',
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use('/api/users', userRouter)
app.use('/api/folders', folderRouter)
app.use('/api/files', fileRouter)
app.use('/api/external_share', externalShare)


export default app;