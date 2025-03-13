const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const db = new sqlite3.Database('./tasks.db');

app.use(cors());
app.use(bodyParser.json());

// Datenbank-Tabelle erstellen, falls nicht vorhanden
db.run('CREATE TABLE IF NOT EXISTS tasks (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, completed BOOLEAN DEFAULT 0)');

// Testroute
app.get('/', (req, res) => {
    res.send('Server läuft!');
});

// Alle Tasks abrufen
app.get('/liste_abrufen', (req, res) => {
    db.all('SELECT * FROM tasks', function (err, rows) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(rows);
        }
    });
});

// Neues Task hinzufügen
app.post('/add', (req, res) => {
    db.run('INSERT INTO tasks (title) VALUES (?)', [req.body.title], function () {
        res.json({ id: this.lastID, title: req.body.title, completed: 0 });
    });
});

// Task löschen
app.delete('/delete/:id', (req, res) => {
    db.run('DELETE FROM tasks WHERE id = ?', [req.params.id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true });
        }
    });
});

// Server starten
app.listen(3050, () => {
    console.log("Server läuft auf http://localhost:3050");
});
