import express from 'express';
const router=express.Router()
import { register, login } from '../controllers/authController.js';

router.post('/register', register);

// Route for user login
router.post('/login', login);

export default router;;