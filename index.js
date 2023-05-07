import express from "express";
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import errors  from "./middleware/error.js";


export const app = express();

// cors
const corsOption = {
    origin: true,
    credentials: true
}
app.use(cors(corsOption))

//json parser
app.use(express.json());

//cookie parser
app.use(cookieParser());


// routes
app.use("/api/v1/user", userRouter);

//error middleware
app.use(errors)
