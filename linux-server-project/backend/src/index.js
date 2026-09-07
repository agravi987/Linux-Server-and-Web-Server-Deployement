import express from 'express';
import pkg from 'pg';
import cors from 'cors';
import dotenv from 'dotenv';

// 2. Load dotenv config
dotenv.config();

const { Pool } = pkg;

// 3. Create an Express app
const app = express();

// 4. Use cors() middleware
app.use(cors());

// 5. Use express.json() middleware
app.use(express.json());

// 6. Create a PostgreSQL pool using DATABASE_URL from .env
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 7. Create route: GET /api/health
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date()
  });
});

// 8. Create route: POST /api/contact
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  try {
    const queryText = 'INSERT INTO contacts(name, email, message) VALUES($1, $2, $3) RETURNING id';
    const result = await pool.query(queryText, [name, email, message]);

    res.status(201).json({
      success: true,
      id: result.rows[0].id
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 9. Create route: GET /api/contacts
app.get('/api/contacts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM contacts');
    
    res.json({
      contacts: result.rows
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 10. Start server on PORT from .env (default 3000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
