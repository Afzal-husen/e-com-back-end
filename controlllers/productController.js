import cloudinary from "cloudinary";
import Product from "../models/productModel.js";

export const newProduct = async (req, res, next) => {
  try {
    let images = [];

    if (typeof req.body.images === "String") {
      images.push(req.body.images);
    } else {
      images = req.body.images;
    }

    let imagesLinks = [];

    for (let i = 0; i < images.length; i++) {
      const result = await cloudinary.v2.uploader.upload(images[i], {
        folder: "products",
      });

      imagesLinks.push({
        public_id: result.public_id,
        url: result.secure_url,
      });
    }

    req.body.images = imagesLinks;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);
    product.save();

    // res.status(200).json({
    //   success: true,
    //   product,
    // });
    res.send("product created")
  } catch (error) {
      console.log(error.message)
    next(error.message);
  }
};

export const getAllProducts = (req, res, next) => {
  res.send("All The Products");
};
