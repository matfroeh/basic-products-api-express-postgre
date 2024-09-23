import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './controllers/products.js';
import productsRouter from './routes/productsRouter.js';
import errorHandler from './middlewares/errorHandler.js';

const app = express();
const port = 3000;

app.use(express.json());

app.use('/products', productsRouter);
app.use('*', (req, res) => res.sendStatus(404));
app.use(errorHandler);
 
app.listen(port, () => console.log(`Server is running on port ${port}`));