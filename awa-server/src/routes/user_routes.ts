import { Router, Request, Response } from 'express'

import { validateRegisterData } from '../middlewares/userValidator'
import userService from '../services/user'

const router = Router()


// Create User 
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

export default router
