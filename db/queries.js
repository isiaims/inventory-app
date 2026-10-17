import pool from "./pool.js";

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      user_name VARCHAR(100) NOT NULL,
      added TIMESTAMPTZ NOT NULL
    );
  `);
}

export async function getMessages() {
  const { rows } = await pool.query(`
        SELECT text, user_name as user, added FROM messages;    
    `);
  return rows;
}

export async function insertMessagesPost({ text, user, added }) {
  await pool.query(
    `INSERT INTO messages (text, user_name, added)
     VALUES ($1, $2, $3)`,
    [text, user, added],
  );
}
createTable();
