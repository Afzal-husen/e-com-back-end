export const send_token_as_cookie = (user, statusCode, res, message) => {
  //create token
  const token = user.createJwtToken();
  //send token as cookie, along wtih expiration and cookie security
  const options = {
    maxAge:  30 * 60 * 1000,
    httpOnly: false,
    // secure: true
  };
  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message: message,
  });
};
