import pool from "./pool.js";
import { products, categories } from "./products.js";

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS categories (
      id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 101) PRIMARY KEY,
      category VARCHAR(255) NOT NULL,
      category_image VARCHAR(255)
    )
  `);
  await pool.query(`
    CREATE TABLE IF NOT EXISTS items (
      item_id INTEGER GENERATED ALWAYS AS IDENTITY (START WITH 1001) PRIMARY KEY,
      item_name VARCHAR(255) NOT NULL,
      price NUMERIC(10, 2) NOT NULL,
      rating NUMERIC(2, 1),
      description TEXT,
      stock INTEGER,
      item_image VARCHAR(255),
      category_id INTEGER NOT NULL REFERENCES categories(id)
    )
  `);
}

export async function getAllCategories() {
  const { rows } = await pool.query(`
        SELECT * FROM categories;    
    `);
  return rows;
}

export async function getAllItems() {
  const { rows } = await pool.query(`
    SELECT items.item_id, items.item_name, items.description, items.price,
           items.rating, items.stock, items.item_image, items.category_id,
           categories.category
    FROM items
    INNER JOIN categories ON categories.id = items.category_id
  `);
  return rows;
}
export async function getItemsByCategory(category) {
  const { rows } = await pool.query(
    `
        SELECT * FROM items WHERE category_id = $1;    
    `,
    [category],
  );
  return rows;
}

export async function getItem(item_id) {
  const { rows } = await pool.query(
    `
        SELECT * FROM items WHERE item_id = $1;    
    `,
    [item_id],
  );
  return rows;
}

export async function addCategory(categoryName) {
  await pool.query(
    `INSERT INTO categories (category)
     VALUES ($1)`,
    [categoryName],
  );
}

export async function deleteCategory(categoryId) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query(
      "UPDATE items SET category_id = 1 WHERE category_id = $1",
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
  price = 2000,
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

async function seedData() {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { rows: itemRows } = await client.query(
      "SELECT EXISTS (SELECT 1 FROM items) AS has_items",
    );
    if (itemRows[0].has_items) {
      await client.query("COMMIT");
      return;
    }

    const categoryIds = new Map();
    for (const category of categories) {
      const { rows: existingCategories } = await client.query(
        "SELECT id FROM categories WHERE category = $1",
        [category],
      );
      let categoryId = existingCategories[0]?.id;

      if (categoryId === undefined) {
        const { rows } = await client.query(
          "INSERT INTO categories (category) VALUES ($1) RETURNING id",
          [category],
        );
        categoryId = rows[0].id;
      }

      categoryIds.set(category, categoryId);
    }

    for (const product of products) {
      const category = categories[product.category_id - 1];
      const categoryId = categoryIds.get(category);
      if (categoryId === undefined) {
        throw new Error(`No category found for product "${product.item_name}"`);
      }

      await client.query(
        `INSERT INTO items
          (item_name, price, rating, stock, description, item_image, category_id)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          product.item_name,
          product.price,
          product.rating,
          product.stock,
          product.description,
          product.item_image,
          categoryId,
        ],
      );
    }

    await client.query("COMMIT");
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

await createTable();
await seedData();
