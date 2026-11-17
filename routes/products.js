import { Router } from "express";
import {
    deleteProduct,
    getAllProducts,
    getProductById,
    AddProduct,
    updateProduct
} from "../conrollers/products.js";
import { validateBody } from "../middlewares/validatejoi.js";
import { productSchema } from "../validations/products.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", validateBody(productSchema), AddProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;