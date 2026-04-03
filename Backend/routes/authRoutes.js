import express from 'express';
import { registerUser,getMe, loginUser,logoutUser } from '../controllers/authController.js'; 
import authUser from '../utilis/getUser.js';



const router = express.Router();


/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

router.post('/register', registerUser);

/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
router.post('/login', loginUser);


router.get("/logout", logoutUser);


router.get("/get-me", authUser,getMe);


export default router;  