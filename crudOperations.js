import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Client } = pg;

export const createProduct = async (req, res) => {
  try { 
    const body = await req.body;
    if (!body) return res.status(404).json({ message: "Body is required" });

    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query(
      "INSERT INTO products (name, image, description, category, price, stock) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;",
      [
        body.name,
        body.image,
        body.description,
        body.category,
        body.price,
        body.stock,
      ]
    );
    await client.end();

    return res.status(201).json(results.rows[0]);
  } catch (error) {
    return res.json({ message: error });
  }
};

export const getProducts = async (req, res) => {
  try {
    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query("SELECT * FROM products;");
    // console.log(results);
    // Select from the right table
    await client.end();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results.rows)); // Return the rows array
  } catch (error) {
    console.error("Error fetching Products: ", error);
    returnErrorWithMessage(res);
  }
};

export const getProductById = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query(
      "SELECT * FROM products WHERE id = $1;",
      [id]
    );
    await client.end();
    if (!results.rowCount)
      return returnErrorWithMessage(res, 404, "Product not found");
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error("Error fetching Product: ", error);
    returnErrorWithMessage(res);
  }
};

export const updateProduct = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const body = await processBodyFromRequest(req);
    if (!body) return returnErrorWithMessage(res, 400, "Body is required");
    const parsedBody = JSON.parse(body);
    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query(
      "UPDATE products SET title = $1, author = $2, content = $3 WHERE id = $4 RETURNING *;",
      [parsedBody.title, parsedBody.author, parsedBody.content, id]
    );
    await client.end();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(results.rows[0]));
  } catch (error) {
    console.error("Error updating product: ", error);
    returnErrorWithMessage(res);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const id = getResourceId(req.url);
    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    await client.query("DELETE FROM products WHERE id = $1;", [id]);
    await client.end();
    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify({ message: "Product deleted successfully" }));
  } catch (error) {
    console.error("Error deleting Product: ", error);
    returnErrorWithMessage(res);
  }
};
