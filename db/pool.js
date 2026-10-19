import { Pool } from "pg";
const { DATABASE_URL } = process.env;

const connectionString = DATABASE_URL;

if (!connectionString) throw new Error("DATABASE_URL must be set");
const pool = new Pool({ connectionString });

export default pool;
