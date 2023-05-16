import express from "express"
import { getAllProducts, newProduct, getProduct } from "../controlllers/productController.js"
import { authentication, authorizeRole } from "../middleware/auth.js"

const router = express.Router()

// admin: create new product
router.post("/newproduct", authentication, authorizeRole("admin"), newProduct)

// get all products
router.get("/allproducts", getAllProducts)

// get single product
router.get("/product/:id", getProduct)

export default router