import express from "express";
import { signUp, signIn, logout, forgetPassword, resetPassword} from "../controlllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/logout", logout);
router.post("/password/forgot", forgetPassword)
router.put("/password/reset/:token", resetPassword)

export default router;
