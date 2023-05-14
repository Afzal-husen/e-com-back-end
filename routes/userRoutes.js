import express from "express";
import { signUp, signIn, logout, forgetPassword, resetPassword, confirmResetToken} from "../controlllers/userController.js";

const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/logout", logout);
router.post("/password/forgot", forgetPassword)
router.put("/password/reset/:token", resetPassword)
router.post("/password/verify", confirmResetToken)

export default router;
