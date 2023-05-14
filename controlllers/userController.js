import User from "../models/userModel.js";
import { send_token_as_cookie } from "../utils/jwtToken.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";

export const signUp = async (req, res, next) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!name) return next(new ErrorHandler("Name cannot be empty"));

  if (!password || !email)
    return next(new ErrorHandler("Email or Password cannot be empty"));

  if (password !== confirmPassword)
    return next(new ErrorHandler("Please confirm your password"));
  try {
    const user = await User.create({ email, name, password });
    const message = "Registered Successfully";
    send_token_as_cookie(user, 200, res, message);
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email || !req.body.password) {
      return next(new ErrorHandler("Email or password cannot be empty", 400));
    }
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler(`No user found with email: ${email}`, 404));
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

    const signedUser = await User.findById(user._id).select("-password");

    const message = "Login Successful";

    send_token_as_cookie(signedUser, 200, res, message);
  } catch (error) {
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    // const option = {
    //   expiration: Date.now(),
    //   httpOnly: true,
    // };
    // res.status(200).cookie("token", null, option).json({
    //   success: true,
    //   message: "user Logged out",
    // });
    res.clearCookie("token").json({
      success: true,
      message: "user Logged out",
    });
  } catch (error) {
    next(error);
  }
};

// forget password
export const forgetPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return next(new ErrorHandler("No user found", 404));

    const resetToken = user.createResetToken();
    await user.save({ validateBeforeSave: false });

    // const resetUrl = `${req.protocol}://${req.get(
    //   "host",
    // )}/password/reset/${resetToken}`;
    
    // const message = `click on ${resetUrl} to recover your password`;
    const message = "Your verification token is:";

    try {
      sendEmail(email, "Password recovery", message, resetToken);

      res.status(200).json({
        success: true,
        message: `Recovery link sent to ${user.email}`,
      });
    } catch (error) {
      user.resetPasswordToken = undefined;
      user.resetTimeLimit = undefined;
      return next(new ErrorHandler(error.message, 500));
    }
  } catch (error) {
    next(error);
  }
};

// reset token
export const resetPassword = async (req, res, next) => {
  try {
    const { password, confirmPassword } = req.body;
    if (!password || !confirmPassword) {
      return next(new ErrorHandler("please provide password", 400));
    }

    const { token } = req.params;

    // const resetPasswordToken = crypto
    //   .createHash("sha256")
    //   .update(token)
    //   .digest("hex");

    const user = await User.findOne({
      resetPasswordToken: token,
      resetTimeLimit: { $gt: Date.now() },
    }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Token Does not match or Token is expired"));
    }

    const passwordExists = await user.comparePassword(password);
    if (passwordExists) {
      return next(
        new ErrorHandler("New password cannot be same as old password"),
      );
    }
    if (req.body.password !== req.body.confirmPassword) {
      return next(new ErrorHandler("Please Confirm Your Password", 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetTimeLimit = undefined;

    await user.save();
    const message = "Password changed successfully";
    send_token_as_cookie(user, 200, res, message);
  } catch (error) {
    console.log(error);
    next(error);
  }
};

// confirm tokem

export const confirmResetToken = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) return next(new ErrorHandler("please provide the token", 400));

    const resetToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: resetToken,
      resetTimeLimit: { $gt: Date.now() },
    });

    if (!user) return next(new ErrorHandler("invalid token", 401));

    const message = "Token is verified";

    res.status(200).json({
      success: true,
      message,
      resetToken
    });
  } catch (error) {
    next(error);
  }
};
