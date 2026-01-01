import { Router, Request, Response } from 'express';

import { validateToken } from '../middlewares/validateToken';
import { validateFolderData } from '../middlewares/fileDataValidator';

import folderServices from '../services/folder';


const router: Router = Router()


// Create a Folder
router.post('/create', validateToken, validateFolderData, async (req: Request, res: Response) => {
  const folderData = req.body;
  folderData.userId = req.user.id;
  try {
    const folder = await folderServices.createFolder(folderData);
    res.status(201).json(folder);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})


// Get User's All folder
router.get('/getFolders', validateToken, async (req: Request, res: Response) => {
  const userId = req.user.id;
  try {
    const folders = await folderServices.getFolders(userId);
    res.status(200).json(folders);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Delete a Folder
router.delete('/delete/:id', validateToken, async (req: Request, res: Response) => {
  const folderId = parseInt(req.params.id);
  const userId = req.user.id;
  try {
    await folderServices.deleteFolder(folderId, userId);
    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

export default router;