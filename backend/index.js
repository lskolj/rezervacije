const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Test ruta
app.get('/api/test', (req, res) => {
    res.json({ message: 'Backend radi!' });
});

app.listen(PORT, () => {
    console.log(`Server radi na http://localhost:${PORT}`);
});
