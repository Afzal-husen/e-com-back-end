import nodemailer from "nodemailer";
import { ErrorHandler } from "./errorHandler.js";

export const sendEmail = async (email, subject, text, token) => {
  try {
    const transporter = nodemailer.createTransport({
      // host: "	smtp.gmail.com",
      service: "gmail",
      port: 587,
      auth: {
        user: process.env.SMPT_MAIL,
        pass: process.env.SMPT_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMPT_MAIL,
      to: email,
      subject: subject,
      text: text,
      html: `<h1>${token}</h1>`
    };
    await transporter.sendMail(mailOptions, (error) => {
      if (error) {
        new ErrorHandler(error.message, 400);
      }
    });
  } catch (error) {
    new ErrorHandler(error.message, 400);
  }
};
