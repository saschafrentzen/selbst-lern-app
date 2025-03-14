const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');
require('dotenv').config();

const app = express();
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.use(cors());
app.use(bodyParser.json());

// Datenbank-Tabelle erstellen
pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY, 
        title TEXT NOT NULL, 
        completed BOOLEAN DEFAULT false
    )
`);

// Testroute
app.get('/', (req, res) => {
    res.send('Server läuft!');
});

// Alle Tasks abrufen
app.get('/liste_abrufen', async (req, res) => {
    try {
        const { rows } = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
        res.json(rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Neues Task hinzufügen
app.post('/add', async (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    try {
        const { rows } = await pool.query(
            'INSERT INTO tasks (title) VALUES ($1) RETURNING *', 
            [title]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Task-Status ändern (Checkbox)
app.patch('/update/:id', async (req, res) => {
    const { completed } = req.body;
    try {
        const { rows } = await pool.query(
            'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
            [completed, req.params.id]
        );
        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Task löschen
app.delete('/delete/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Server starten
app.listen(3050, () => {
    console.log("Server läuft auf http://localhost:3050");
});
