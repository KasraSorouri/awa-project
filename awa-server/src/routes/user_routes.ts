import { Router, Request, Response } from 'express'

import { validateRegisterData, validateLoginData } from '../middlewares/userValidator'
import { validateToken } from '../middlewares/validateToken'
import userService from '../services/user'

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

export default router
