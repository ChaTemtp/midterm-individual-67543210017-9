const bookRepo = require('../../data/repositories/bookRepository');

class BookController {
    async getAllBooks(req, res, next) {
        try {
            const statusFilter = req.query.status;
            let books = await bookRepo.getAll();
            if (statusFilter) {
                books = books.filter(b => b.status === statusFilter);
            }
            const stats = {
                available: books.filter(b => b.status === 'available').length,
                borrowed: books.filter(b => b.status === 'borrowed').length,
                total: books.length
            };
            res.json({ books, statistics: stats });
        } catch (err) { next(err); }
    }

    async getBookById(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });

            const book = await bookRepo.getById(id);
            if (!book) return res.status(404).json({ error: 'Book not found' });

            res.json(book);
        } catch (err) { next(err); }
    }

    async createBook(req, res, next) {
        try {
            const { title, author, isbn } = req.body;
            if (!title || !author || !isbn) return res.status(400).json({ error: 'Title, author, ISBN required' });

            const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
            if (!isbnPattern.test(isbn.replace(/-/g, ''))) return res.status(400).json({ error: 'Invalid ISBN format' });

            const book = await bookRepo.create({ title, author, isbn });
            res.status(201).json(book);
        } catch (err) {
            if (err.message.includes('UNIQUE')) res.status(409).json({ error: 'ISBN already exists' });
            else next(err);
        }
    }

    async updateBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const { title, author, isbn } = req.body;
            if (isNaN(id)) return res.status(400).json({ error: 'Invalid book ID' });
            if (!title || !author || !isbn) return res.status(400).json({ error: 'Title, author, ISBN required' });

            const isbnPattern = /^(97[89])?\d{9}[\dXx]$/;
            if (!isbnPattern.test(isbn.replace(/-/g, ''))) return res.status(400).json({ error: 'Invalid ISBN format' });

            const updated = await bookRepo.update(id, { title, author, isbn });
            res.json(updated);
        } catch (err) {
            if (err.message.includes('UNIQUE')) res.status(409).json({ error: 'ISBN already exists' });
            else next(err);
        }
    }

    async borrowBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updated = await bookRepo.borrow(id);
            res.json(updated);
        } catch (err) { next(err); }
    }

    async returnBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            const updated = await bookRepo.return(id);
            res.json(updated);
        } catch (err) { next(err); }
    }

    async deleteBook(req, res, next) {
        try {
            const id = parseInt(req.params.id);
            await bookRepo.delete(id);
            res.json({ message: 'Book deleted successfully' });
        } catch (err) { next(err); }
    }
}

module.exports = new BookController();
