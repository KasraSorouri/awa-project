import { Router, Request, Response } from 'express'

import { validateRegisterData } from '../middlewares/userValidator'
import userService from '../services/user'

const router = Router()


// Create User 
router.post('/users', validateRegisterData, async(req: Request, res: Response) => {
  try {
    const result = await userService.createUser(req.body)
    if (!result) {
      return res.status(500).json({ error: 'Error creating user' })
    }
    return res.status(201).json(result)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Error creating user' })
  }

})
