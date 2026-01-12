// server.js - Monolithic Library Management System
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(express.json());
app.use(express.static('public'));

// Database connection (ปนกับทุกอย่าง)
const db = new sqlite3.Database('./library.db', (err) => {
    if (err) console.error('Database error:', err);
    else console.log('Connected to SQLite database');
});

// Create tables if not exists
db.run(`CREATE TABLE IF NOT EXISTS books (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    isbn TEXT UNIQUE NOT NULL,
    status TEXT DEFAULT 'available',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);

// ===== API ENDPOINTS =====

// GET /api/books - ดึงหนังสือทั้งหมด
app.get('/api/books', (req, res) => {
    const { status } = req.query;
    
    let sql = 'SELECT * FROM books';
    let params = [];
    
    if (status) {
        sql += ' WHERE status = ?';
        params.push(status);
    }
    
    db.all(sql, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        const available = rows.filter(b => b.status === 'available').length;
        const borrowed = rows.filter(b => b.status === 'borrowed').length;
        
        res.json({
            books: rows,
            statistics: { available, borrowed, total: rows.length }
        });
    });
});

// GET /api/books/:id - ดึงหนังสือเล่มเดียว
app.get('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    
    if (isNaN(id)) {
        return res.status(400).json({ error: 'Invalid book ID' });
    }
    
    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        if (!row) return res.status(404).json({ error: 'Book not found' });
        res.json(row);
    });
});

// POST /api/books - เพิ่มหนังสือใหม่
app.post('/api/books', (req, res) => {
    const { title, author, isbn } = req.body;
    
    if (!title || !author || !isbn) {
        return res.status(400).json({ error: 'Title, author, and ISBN are required' });
    }
    
    const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
    if (!isbnPattern.test(isbn.replace(/-/g, ''))) {
        return res.status(400).json({ error: 'Invalid ISBN format' });
    }
    
    const sql = 'INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)';
    db.run(sql, [title, author, isbn], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE')) {
                return res.status(409).json({ error: 'ISBN already exists' });
            }
            console.error('Database error:', err);
            return res.status(500).json({ error: 'Database error' });
        }
        
        db.get('SELECT * FROM books WHERE id = ?', [this.lastID], (err, row) => {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.status(201).json(row);
        });
    });
});

// PUT /api/books/:id - อัพเดทหนังสือ
app.put('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const { title, author, isbn } = req.body;
    
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });
    if (!title || !author || !isbn) return res.status(400).json({ error: 'Title, author, and ISBN are required' });

    const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
    if (!isbnPattern.test(isbn.replace(/-/g, ''))) return res.status(400).json({ error: 'Invalid ISBN format' });

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Book not found' });

        const sql = 'UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?';
        db.run(sql, [title, author, isbn, id], function(err) {
            if (err) {
                if (err.message.includes('UNIQUE')) return res.status(409).json({ error: 'ISBN already exists' });
                return res.status(500).json({ error: 'Database error' });
            }

            db.get('SELECT * FROM books WHERE id = ?', [id], (err, updatedRow) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(updatedRow);
            });
        });
    });
});

// PATCH /api/books/:id/borrow - ยืมหนังสือ
app.patch('/api/books/:id/borrow', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Book not found' });
        if (row.status === 'borrowed') return res.status(400).json({ error: 'Book is already borrowed' });

        db.run('UPDATE books SET status = ? WHERE id = ?', ['borrowed', id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM books WHERE id = ?', [id], (err, updatedRow) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(updatedRow);
            });
        });
    });
});

// PATCH /api/books/:id/return - คืนหนังสือ
app.patch('/api/books/:id/return', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Book not found' });
        if (row.status !== 'borrowed') return res.status(400).json({ error: 'Book is not borrowed' });

        db.run('UPDATE books SET status = ? WHERE id = ?', ['available', id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });

            db.get('SELECT * FROM books WHERE id = ?', [id], (err, updatedRow) => {
                if (err) return res.status(500).json({ error: 'Database error' });
                res.json(updatedRow);
            });
        });
    });
});

// DELETE /api/books/:id - ลบหนังสือ
app.delete('/api/books/:id', (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });

    db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
        if (err) return res.status(500).json({ error: 'Database error' });
        if (!row) return res.status(404).json({ error: 'Book not found' });
        if (row.status === 'borrowed') return res.status(400).json({ error: 'Cannot delete borrowed book' });

        db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
            if (err) return res.status(500).json({ error: 'Database error' });
            res.json({ message: 'Book deleted successfully' });
        });
    });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Library Management System running on http://localhost:${PORT}`);
});
