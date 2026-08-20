import express from 'express'
import User from '../models/User.js'
import { protect } from '../middleware/authMiddleware.js'
import { authorizeRoles } from '../middleware/roleMiddleware.js'
import { HTTP_STATUS } from '../../constants.js'

const router = express.Router()

router.get('/api/users', protect, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {
    const users = await User.find().select('name email role')
    res.status(HTTP_STATUS.OK).json(users)
  } catch (error) {
    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message })
  }
})

export default router