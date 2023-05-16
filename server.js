import dotenv from "dotenv";
import { app } from "./index.js";
import { connectDB } from "./config/connectDB.js";
import cloudinary from "cloudinary";

dotenv.config();
const port = 5000;

// cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI).then((data) =>
      console.log(`MongoDb connected with server: ${data.connection.host}`),
    );
    console.log("connected to DB");
    app.listen(port, console.log(`server running on port ${port}...`));
  } catch (error) {
    console.log(error);
  }
};

start();
