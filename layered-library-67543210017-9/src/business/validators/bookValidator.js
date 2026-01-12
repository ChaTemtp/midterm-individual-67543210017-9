class BookValidator {
    validateId(id) {
        const num = parseInt(id);
        if (isNaN(num) || num <= 0) throw new Error('Invalid book ID');
        return num;
    }
    validateBookData(data) {
        const { title, author, isbn } = data;
        if (!title || !author || !isbn) throw new Error('Title, author, and ISBN required');
    }
    validateISBN(isbn) {
        const clean = isbn.replace(/-/g, '');
        const pattern = /^(97[89])?\d{9}[\dXx]$/;
        if (!pattern.test(clean)) throw new Error('Invalid ISBN format');
    }
}

module.exports = new BookValidator();
