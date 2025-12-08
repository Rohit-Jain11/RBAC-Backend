const pool = require('./db');

const initDB = async () => {
    try {
        await pool.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role INTEGER DEFAULT 2,
                created_at TIMESTAMP DEFAULT NOW()
            );
        `);

        console.log("✅ Users table is ready.");
    } catch (err) {
        console.error("❌ Database initialization failed:", err);
    }
};

module.exports = initDB;
