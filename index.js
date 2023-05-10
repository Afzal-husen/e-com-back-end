import express from "express";
import userRouter from "./routes/userRoutes.js"
import cookieParser from "cookie-parser";
import cors from "cors"
import errors  from "./middleware/error.js";
import path, { dirname } from "path"
import url from "url"
// const __filename = url.fileURLToPath(import.meta.url)
// const __dirname = url.fileURLToPath(new URL(".", import.meta.url))


export const app = express();

// serving front end static files
app.use(express.static(path.join("./public/build")))

app.get("*", async (req, res, next) => {
    try {  
        res.sendFile(path.resolve( "./public/build/index.html"))
    } catch (error) {
        res.send("Somethin went wrong")
        // next(error)
        console.log(error.message)
    }
})

// // cors
// const corsOption = {
//     origin: true,
//     credentials: true
// }
// app.use(cors(corsOption))

//json parser
app.use(express.json());

//cookie parser
app.use(cookieParser());


// routes
app.use("/api/v1/user", userRouter);

//error middleware
app.use(errors)
