import { Router, Request, Response } from 'express';

import { validateToken } from '../middlewares/validateToken';
import { validateFileData } from '../middlewares/fileDataValidator';
import upload from '../middlewares/multerMiddleware';

import fileServices from '../services/file';
import { IEditFileData } from '../types/fileTypes';

const router = Router();

// Create a File
router.post('/create', validateToken, validateFileData, async (req: Request, res: Response) => {
  const fileData = req.body;
  fileData.userId = req.user.id;
  try {
    const result = await fileServices.createFile(fileData);
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return   res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Upload a File
router.post('/upload', validateToken, upload.single('file') , async (req: Request, res: Response) => {
  const fileData = req.body;
  console.log('body: ',req.body);
  console.log('file : ',req.file);
  fileData.userId = req.user.id;

  const file: Express.Multer.File | undefined = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const result = await fileServices.uploadFile(fileData, file)
    return res.status(201).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Delete a File
router.delete('/delete/:id', validateToken, async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id);
  const userId = req.user.id;
  try {
    const folder = await fileServices.deleteFile(fileId, userId);
    return res.status(200).json(folder);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})


// Remove a File
router.post('/remove', validateToken, async (req: Request, res: Response) => {
  const fileIds = req.body.fileIds as number[];
  const userId = req.user.id;
  try {
    const folder = await fileServices.removeFile(fileIds, userId);
    return res.status(200).json(folder);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Edit a File
router.get('/edit/:id', validateToken, async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id);
  const userId = req.user.id;
  try {
    const fileContent = await fileServices.openFile(fileId, userId);
    return res.status(200).json(fileContent);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Save a File
router.post('/save/:id', validateToken, async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id);
  const userId = req.user.id;
  const fileData: IEditFileData = req.body.fileData;
  try {
    const file = await fileServices.saveFile(fileId, fileData, userId);
    return res.status(200).json(file);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Read Recycle Bin Files
router.get('/recycle-bin', validateToken,  async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const files = await fileServices.getRecycledFiles(userId);
    return res.status(200).json(files);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Restore File
router.post('/restore', validateToken, async (req: Request, res: Response) => {
  const fileIds = req.body.fileIds as number[];
  const userId = req.user.id;
  try {
    const result = await fileServices.restoreFile(fileIds, userId);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})


export default router;