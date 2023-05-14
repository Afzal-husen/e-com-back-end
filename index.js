import express from "express";
import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import errors from "./middleware/error.js";
import cloudinary from "cloudinary"

export const app = express();

// serving front end static files
// app.use(express.static(path.join("./public/build")))

// app.get("*", async (req, res, next) => {
//     try {
//         res.sendFile(path.resolve( "./public/build/index.html"))
//     } catch (error) {
//         res.send("Somethin went wrong")
//         // next(error)
//         console.log(error.message)
//     }
// })

// // cors
const corsOption = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOption));

//json parser
app.use(express.json());

//cookie parser
app.use(cookieParser());

// routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/products", productRouter);

//error middleware
app.use(errors);

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
