const books = require("./books");
const {nanoid} = require("nanoid");
const addBookHandler = (request, h) => {
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message : 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const newBook = {
        id, name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    }
    books.push(newBook);
    const isSuccess = books.filter((book) => book.id === id).length > 0;
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        }).code(201);
    }else {
        return h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        }).code(500);
    }

}

const getAllBooksHandler = (request, h) => {
    const {name, reading, finished} = request.query;
    if (name !== undefined) {
        books.filter((book) => book.name.toLowerCase().includes(name.toLowerCase()));
    }
    if (reading !== undefined) {
        books.filter((book) => book.reading === (reading === 1));
    }
    if (finished !== undefined) {
        books.filter((book) => book.finished === (finished === 1));
    }
    return h.response({
        status: 'success',
        data: {
            books: books.map((book) => ({
                id: book.id,
                name: book.name,
                publisher: book.publisher
            }))
        }
    });

}

const editBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const {name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;
    const updatedAt = new Date().toISOString();

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message : 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
    }

    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books[index] = {
            ...books[index],
            name, year, author, summary, publisher, pageCount, readPage, reading, updatedAt
        }
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    }).code(404);
}

const getBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const book = books.filter((b) => b.id === bookId)[0];

    if (book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book
            }
        }).code(200);
    }

    return h.response({
        status : 'fail',
        message : 'Buku tidak ditemukan'
    })
}

const deleteBookByIdHandler = (request, h) => {
    const {bookId} = request.params;
    const index = books.findIndex((book) => book.id === bookId);
    if (index !== -1) {
        books.splice(index, 1);
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        }).code(200);
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    }).code(404);

}

module.exports = { addBookHandler, getAllBooksHandler, editBookByIdHandler, getBookByIdHandler, deleteBookByIdHandler }