// node-app/index.js

const express = require('express');
const mysql = require('mysql2'); // Use mysql2 instead of mysql
const methodOverride = require('method-override');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Create a MySQL connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Connect to the database
db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

// Routes

// Get all items
app.get('/', (req, res) => {
    db.query('SELECT * FROM items', (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('index', { items: results });
    });
});

// Add a new item
app.post('/items', (req, res) => {
    const item = req.body;
    db.query('INSERT INTO items SET ?', item, (err, result) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Get edit form
app.get('/items/edit/:id', (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM items WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).send(err);
        res.render('edit', { item: results[0] });
    });
});

// Update an item
app.put('/items/:id', (req, res) => {
    const id = req.params.id;
    const updatedItem = req.body;
    db.query('UPDATE items SET ? WHERE id = ?', [updatedItem, id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Delete an item
app.delete('/items/:id', (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM items WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).send(err);
        res.redirect('/');
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
