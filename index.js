import express from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct } from './crudOperations.js';

const app = express();
const port = 3000;

app.use(express.json());

app.get('/products', getProducts);
app.post('/products', createProduct);
app.get('/products/:id', getProductById);
app.put('/products/:id', updateProduct);
app.delete('/products/:id', deleteProduct);
 
app.listen(port, () => console.log(`Server is running on port ${port}`));