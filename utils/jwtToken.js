export const send_token_as_cookie = (user, statusCode, res) => {
  //create token
  const token = user.createJwtToken();
  //send token as cookie, along wtih expiration and cookie security
  const options = {
    maxAge:   60 * 60 * 1000,
    httpOnly: false,
  };
  res.status(statusCode).cookie("access_token", token, options).json({
    success: true,
    user,
    token
  });
};
