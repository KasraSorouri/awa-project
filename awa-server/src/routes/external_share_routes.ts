import { Router, Request, Response } from 'express';

import { validateToken } from '../middlewares/validateToken';

import externalShareServices from '../services/external_share';
import { FRONTEND_URL } from '../configs/config';

const router = Router();


// Shared External User
router.post('/:id', validateToken, async (req: Request, res: Response) => {
  const fileId = parseInt(req.params.id);
  const userId = req.user.id;
  const duration = req.body.duration;
  console.log('body:', req.body);

  try {
    const link = await externalShareServices.externalShareFile(fileId, userId, duration);
    return res.status(200).json(link);
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

// Get a Link and Redirect 
router.get('/link/:link', async(req: Request, res: Response) => {
  console.log('params:', req.params);
  const shareLink = req.params.link;
  try {
    const result = await externalShareServices.getExternalShare(shareLink);
    if (result === true) {
      return res.redirect(`${FRONTEND_URL}/share/${shareLink}`)
    } else {
      return res.status(400).json({error: 'Link is invalid'})
    }
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})
 

// Share the File 
router.get('/share/:link', async(req: Request, res: Response) => {
  console.log('params:', req.params);
  const shareLink = req.params.link;
  try {
    const file = await externalShareServices.getFile(shareLink);
    console.log('file:', file);
    return res.status(200).json(file);
  
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message });
    } else {
      return res.status(500).json({ error: 'An unexpected error occurred' });
    }
  }
})

router 
export default router;