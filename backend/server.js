const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const PORT = 3000;

const db = new sqlite3.Database('restaurant.db');

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS menu (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT UNIQUE,
        description TEXT
    )`);

    const dishes = [
        ['sushi', 'Ein leckerer Mix aus Sushi.'],
        ['pizza', 'Eine köstliche Pizza.'],
        ['taco', 'Ein herzhafter mexikanischer Mix.']
    ];

    dishes.forEach(([name, description]) => {
        db.run('INSERT OR IGNORE INTO menu (name, description) VALUES (?, ?)', [name, description]);
    });
});

app.get('/:dish', (req, res) => {
    db.get('SELECT description FROM menu WHERE name = ?', [req.params.dish], (_, row) => 
        res.send(row ? row.description : 'Gericht nicht gefunden.')
    );
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
