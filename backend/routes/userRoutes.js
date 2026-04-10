
import express from 'express'

import User from '../models/User.js'
//
import { protect } from '../middleware/authMiddleware.js'
// import role from "../middleware/roleMiddleware.js"
import { authorizeRoles } from '../middleware/roleMiddleware.js'

const router = express.Router();

router.get('/api/users', protect, authorizeRoles('admin', 'employee'), async (req, res) => {
  try {

    // const users = await User.find().select('name', 'email', 'role')
    const users = await User.find().select('name email role')
    // console.log(users)
    res.status(200).json(users);
  } 
  catch (error) {
    // console.log(error.message, "status code (500)")
    res.status(500).json({ message: error.message })
  }
});

export default router;