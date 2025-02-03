import { Router } from "express";
import { registerUser, loginUser, getUser } from "../controllers/userController";

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/', getUser);

export default router;