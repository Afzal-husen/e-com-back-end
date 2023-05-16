import cloudinary from "cloudinary";
import Product from "../models/productModel.js";
import { ErrorHandler } from "../utils/errorHandler.js";
import productModel from "../models/productModel.js";

// create a product
export const newProduct = async (req, res, next) => {
  try {
    const reviews = req.body.reviews[0];

    let images = [];

    if (typeof req.body.images === "string") {
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
    reviews.user = req.user.id;

    const product = await Product.create(req.body);
    product.save();

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.log("an error has occured");
    console.log(error);
    next(error);
  }
};

// get all products
export const getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find({});
    if (!products)
      return next(new ErrorHandler("No Product available for display", 404));

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// get single product
export const getProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await productModel.findById(id);

    if (!product) return next(new ErrorHandler("No product found", 404));

    res.status(200).json({
      success: true,
      product
    })

  } catch (error) {
    next(error);
  }
};
