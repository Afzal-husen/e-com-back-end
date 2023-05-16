import express from "express"
import { getAllProducts, newProduct } from "../controlllers/productController.js"
import { authentication, authorizeRole } from "../middleware/auth.js"

const router = express.Router()

// admin: create new product
router.post("/newproduct", authentication, authorizeRole("admin"), newProduct)

// get all products
router.get("/allproducts", getAllProducts)

export default router