import express from "express";
import { signUp, signIn, logout } from "../controlllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout);

export default router;
