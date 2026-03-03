
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve("./.env.local") });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  console.log("DATABASE_URL =", process.env.DATABASE_URL); // debug
  try {
    const res = await pool.query("SELECT NOW()");
    console.log("Database connected! Current time:", res.rows[0]);
    //process.exit(0);
  } catch (err) {
    console.error("Database connection failed:", err);
    //process.exit(1);
  }
}

export default pool;

testConnection();