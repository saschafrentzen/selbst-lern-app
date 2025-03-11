const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = 5001; // Server 2 läuft auf Port 5001

app.use(cors());
app.use(express.json());

// Route, um die Gerichte von Server 1 zu holen
app.get('/get-dishes', async (req, res) => {
    try {
        const response = await axios.get('http://localhost:3000/dishes'); // Server 1 URL angepasst
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Fehler beim Abrufen der Gerichte' });
    }
});

app.listen(PORT, () => {
    console.log(`Server 2 läuft auf http://localhost:${PORT}`);
});