import { Router, Request, Response } from 'express'

import { validateRegisterData, validateLoginData } from '../middlewares/userValidator'
import { validateToken } from '../middlewares/validateToken'
import userService from '../services/user'
import upload from '../middlewares/multerMiddleware'
import path from 'path'

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const router = Router()


// Register User 
router.post('/register', validateRegisterData, async(req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Invalid request body' })
  }
  try {
    const result = await userService.createUser(req.body)

    return res.status(201).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error creating user' })
  }
})

// Login User
router.post('/login', validateLoginData, async(req: Request, res: Response) => {
  if (!req.body) {
    return res.status(400).json({ error: 'Invalid request body' })
  }
  try {
    const result = await userService.loginUser(req.body)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error Login user' })
  }
})

router.get('/user', validateToken, async(req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }

  try {
    const result = await userService.getUser(req.user.id)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error getting users' })
  }
})

router.get('/users', validateToken, async(req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const result = await userService.getAllUsers(req.user.id)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(404).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error getting users' })
  }
})

router.put('/update', validateToken, async(req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  try {
    const result = await userService.updateUser(req.user.id, req.body)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error updating user' })
  }
})

router.post('/upload-picture', validateToken, upload.single('file'), async(req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const file: Express.Multer.File | undefined = req.file
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' })
  }
  try {
    const result = await userService.uploadProfilePicture(req.user.id, file)

    return res.status(200).json(result)
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error uploading profile picture' })
  }
})

router.get('/profile-picture', validateToken, async(req: Request, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  const userId = req.user.id
  const picture = req.params.pic
  try {
    const picAddress = await userService.getProfilePicture(userId)

    const picPath = path.join(__dirname, '../../../', picAddress);
    return res.sendFile(picPath, (err) => {
      if (err) {
        res.status(404).json({ error: "File not found on disk" });
      }
    });

  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error getting profile picture' })
  }
})

router.get('/stats',validateToken,  async(req: Request, res: Response) => {
  const userId = req.user.id
  try {
    const stats = await userService.getStats(userId)

    return res.status(200).json(stats)
 
  } catch (error) {
    if (error instanceof Error) {
      return res.status(400).json({ error: error.message })
    }
    console.error(error)
    return res.status(500).json({ error: 'Error getting Stats' })
  }
})

export default router
