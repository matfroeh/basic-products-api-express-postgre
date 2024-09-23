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
    return res.status(400).json({ message: error });
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

    return res.status(200).json(results.rows);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query(
      "SELECT * FROM products WHERE id = $1;",
      [id]
    );
    await client.end();
    if (!results.rowCount) return res.json({ message: "Product not found" });
    res.status(200).json(results.rows[0]);
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;

    if (!body) return res.status(404).json({ message: "Body is required" });

    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    const results = await client.query(
      "UPDATE products SET name = $1, image = $2, description = $3, category = $4, price = $5, stock = $6 WHERE id = $7 RETURNING *;",
      [
        body.name,
        body.image,
        body.description,
        body.category,
        body.price,
        body.stock,
        id,
      ]
    );
    await client.end();

    return res.status(200).json(results.rows[0]);
  } catch (error) {
    console.error("Error updating product: ", error);
    return res.status(400).json({ message: error });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const client = new Client({
      connectionString: process.env.PG_URI,
    });
    await client.connect();
    await client.query("DELETE FROM products WHERE id = $1;", [id]);
    await client.end();

    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting Product: ", error);
    return res.status(400).json({ message: error });
  }
};
