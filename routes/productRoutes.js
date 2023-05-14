import express from "express"
import { getAllProducts, newProduct } from "../controlllers/productController.js"
import { authentication } from "../middleware/auth.js"

const router = express.Router()

router.post("/newproduct", authentication, newProduct)
router.get("/allproducts", getAllProducts)

export default router