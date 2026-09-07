import pkg from 'pg';
import dotenv from 'dotenv';

// 2. Load dotenv config
dotenv.config();

const { Pool } = pkg;

// 3. Create a PostgreSQL pool using DATABASE_URL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function initDatabase() {
  // 4. Create SQL query
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  try {
    // 5. Run the query
    await pool.query(createTableQuery);
    
    // 6. Log success message
    console.log("Database table created successfully");
  } catch (error) {
    console.error("Error creating database table:", error.message);
  } finally {
    // 7. Close the pool
    await pool.end();
  }
}

initDatabase();
