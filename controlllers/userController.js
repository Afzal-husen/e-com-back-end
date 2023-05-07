import User from "../models/userModel.js";
import { send_token_as_cookie } from "../utils/jwtToken.js";
import { ErrorHandler } from "../utils/errorHandler.js";

export const signUp = async (req, res, next) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.create({ email, name, password });
    send_token_as_cookie(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !req.body.password) {
      next(new ErrorHandler("Email or password cannot be empty", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      next(new ErrorHandler(`No user found with email: ${email}`));
    }
    const isPasswordCorrect = await user.comparePassword(req.body.password);
    if (!isPasswordCorrect) {
      return next(
        new ErrorHandler(
          "Wrong password!, please provide correct password",
          401,
        ),
      );
    }

    send_token_as_cookie(user, 200, res);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    const option = {
      expiration: Date.now(),
      httpOnly: true
    }
    // res.status(200).cookie("token", null, option).json({
    //   success: true,
    //   message: "user Logged out"
    // })
    res.clearCookie()
  } catch (error) {
    next(error);
  }
};
