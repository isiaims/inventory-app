import pool from "./pool.js";
import bcrypt from "bcrypt";
import { products, categories } from "./products.js";

// async function createTable() {
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS categories (
//       id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 101) PRIMARY KEY,
//       category VARCHAR(255) NOT NULL,
//       category_image VARCHAR(255)
//     )
//   `);
//   await pool.query(`
//     CREATE TABLE IF NOT EXISTS items (
//       item_id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1001) PRIMARY KEY,
//       item_name VARCHAR(255) NOT NULL,
//       price NUMERIC(10, 2) NOT NULL,
//       rating NUMERIC(2, 1),
//       description TEXT,
//       stock INTEGER,
//       item_image VARCHAR(255),
//       category_id INTEGER NOT NULL REFERENCES categories(id)
//     )
//   `);
// }

export async function getAllCategories() {
  const { rows } = await pool.query(`
        SELECT * FROM categories;    
    `);
  return rows;
}

export async function getCategoryById(categoryId) {
  const { rows } = await pool.query("SELECT * FROM categories WHERE id = $1", [
    categoryId,
  ]);
  return rows[0] ?? null;
}

export async function getAllItems() {
  const { rows } = await pool.query(`
    SELECT items.*, categories.category
    FROM items
    INNER JOIN categories ON categories.id = items.category_id
  `);
  return rows;
}
export async function getItemsByCategory(categoryId) {
  const { rows } = await pool.query(
    `
        SELECT items.*, categories.category FROM items
        INNER JOIN categories
        ON categories.id = items.category_id
        WHERE category_id = $1;    
    `,
    [categoryId],
  );
  return rows;
}

export async function addCategory({ categoryName, fileName }) {
  const categoryImage = `assets/${fileName}`;
  await pool.query(
    `INSERT INTO categories (category, category_image)
     VALUES ($1, $2)`,
    [categoryName, categoryImage],
  );
}

export async function deleteCategory(categoryId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      `UPDATE items SET category_id = (SELECT id FROM categories WHERE category = 'general')
      WHERE category_id = $1`,
      [categoryId],
    );
    await client.query("DELETE FROM categories WHERE category = $1", [
      categoryId,
    ]);
    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

export async function addItemToCategory({
  name,
  price = 100,
  rating = 4,
  stock,
  description,
  itemImage,
  categoryId,
}) {
  await pool.query(
    `
    INSERT INTO items (item_name, price, rating, stock, description, item_image, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
  `,
    [name, price, rating, stock, description, itemImage, categoryId],
  );
}

export async function updateItem({
  name,
  price,
  rating,
  stock,
  description,
  categoryId,
  item_id,
}) {
  await pool.query(
    `
    UPDATE items 
    SET item_name = $1, price = $2, rating = $3, stock = $4, description = $5, category_id = $6
    WHERE item_id = $7;
  `,
    [name, price, rating, stock, description, categoryId, item_id],
  );
}

export async function deleteItem(item_id) {
  await pool.query("DELETE FROM items WHERE item_id = $1", [item_id]);
}

// const plainPassword = process.env.ADMIN_PASS;

// const hash = await bcrypt.hash(plainPassword, 12);

// await pool.query("UPDATE auth SET pass = $1 WHERE id = $2", [hash, 1]);

export async function getAuth() {
  const { rows } = await pool.query("SELECT pass FROM auth WHERE id = $1", [1]);
  return rows;
}
