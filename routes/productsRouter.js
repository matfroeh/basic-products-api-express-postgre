import { Router } from "express";
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/products.js';

const productsRouter = Router();

productsRouter.route('/').get(getProducts).post(createProduct);
productsRouter.route('/:id').get(getProductById).put(updateProduct).delete(deleteProduct);

export default productsRouter;