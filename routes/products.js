import { Router } from "express";
import {
    deleteProduct,
    getAllProducts,
    getProductById,
    addProduct,
    updateProduct
} from "../conrollers/products.js";
import { validateBody } from "../middlewares/validatejoi.js";
import { productSchema } from "../validations/products.js";

const router = Router();

router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", validateBody(productSchema), addProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

export default router;