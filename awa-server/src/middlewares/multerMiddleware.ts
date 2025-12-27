import multer, { Multer, StorageEngine } from 'multer';

const storage: StorageEngine = multer.memoryStorage(); 

const upload: Multer = multer({ storage: storage });

export default upload;

