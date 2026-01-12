const bookRepo = require('../../data/repositories/bookRepository');
const validator = require('../validators/bookValidator');

class BookService {
    async getAllBooks(status) {
        if (status) validator.validateId(status); // optional filter
        const books = await bookRepo.findAll(status);
        const stats = {
            total: books.length,
            available: books.filter(b => b.status === 'available').length,
            borrowed: books.filter(b => b.status === 'borrowed').length
        };
        return { books, statistics: stats };
    }

    async getBookById(id) {
        const num = validator.validateId(id);
        const book = await bookRepo.findById(num);
        if (!book) throw new Error('Book not found');
        return book;
    }

    async createBook(data) {
        validator.validateBookData(data);
        validator.validateISBN(data.isbn);
        return bookRepo.create(data);
    }

    async updateBook(id, data) {
        validator.validateId(id);
        validator.validateBookData(data);
        validator.validateISBN(data.isbn);
        return bookRepo.update(id, data);
    }

    async borrowBook(id) {
        const book = await this.getBookById(id);
        if (book.status === 'borrowed') throw new Error('Already borrowed');
        return bookRepo.updateStatus(id, 'borrowed');
    }

    async returnBook(id) {
        const book = await this.getBookById(id);
        if (book.status !== 'borrowed') throw new Error('Not borrowed');
        return bookRepo.updateStatus(id, 'available');
    }

    async deleteBook(id) {
        const book = await this.getBookById(id);
        if (book.status === 'borrowed') throw new Error('Cannot delete borrowed book');
        await bookRepo.delete(id);
        return { message: 'Book deleted' };
    }
}

module.exports = new BookService();
