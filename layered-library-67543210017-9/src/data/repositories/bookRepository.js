const db = require('../database/connection');

class BookRepository {
    async getAll() {
        return new Promise((resolve, reject) => {
            db.all('SELECT * FROM books', [], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }

    async getById(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                if (err) reject(err);
                else resolve(row);
            });
        });
    }

    async create(bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('INSERT INTO books (title, author, isbn) VALUES (?, ?, ?)',
                [title, author, isbn],
                function(err) {
                    if (err) reject(err);
                    else resolve({ id: this.lastID, title, author, isbn, status: 'available' });
                });
        });
    }

    async update(id, bookData) {
        const { title, author, isbn } = bookData;
        return new Promise((resolve, reject) => {
            db.run('UPDATE books SET title = ?, author = ?, isbn = ? WHERE id = ?',
                [title, author, isbn, id],
                function(err) {
                    if (err) reject(err);
                    else {
                        db.get('SELECT * FROM books WHERE id = ?', [id], (err, row) => {
                            if (err) reject(err);
                            else resolve(row);
                        });
                    }
                });
        });
    }

    async borrow(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
                if (err) return reject(err);
                if (!book) return reject(new Error('Book not found'));
                if (book.status === 'borrowed') return reject(new Error('Book already borrowed'));

                db.run('UPDATE books SET status = ? WHERE id = ?', ['borrowed', id], function(err) {
                    if (err) reject(err);
                    else resolve({ ...book, status: 'borrowed' });
                });
            });
        });
    }

    async return(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
                if (err) return reject(err);
                if (!book) return reject(new Error('Book not found'));
                if (book.status === 'available') return reject(new Error('Book not borrowed'));

                db.run('UPDATE books SET status = ? WHERE id = ?', ['available', id], function(err) {
                    if (err) reject(err);
                    else resolve({ ...book, status: 'available' });
                });
            });
        });
    }

    async delete(id) {
        return new Promise((resolve, reject) => {
            db.get('SELECT * FROM books WHERE id = ?', [id], (err, book) => {
                if (err) return reject(err);
                if (!book) return reject(new Error('Book not found'));
                if (book.status === 'borrowed') return reject(new Error('Cannot delete borrowed book'));

                db.run('DELETE FROM books WHERE id = ?', [id], function(err) {
                    if (err) reject(err);
                    else resolve(true);
                });
            });
        });
    }
}

module.exports = new BookRepository();
