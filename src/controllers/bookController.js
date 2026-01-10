const Book = require('../models/book');

// @desc    Get all books (with search and pagination)
// @route   GET /api/books
// @access  Public
exports.getAllBooks = async (req, res, next) => {
    try {
        // Build query
        let query = {};

        // Search by author
        if (req.query.author) {
            query.author = { $regex: req.query.author, $options: 'i' };
        }

        // Search by genre
        if (req.query.genre) {
            query.genre = { $regex: req.query.genre, $options: 'i' };
        }

        // Pagination
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const books = await Book.find(query)
            .skip(skip)
            .limit(limit);

        const total = await Book.countDocuments(query);

        res.status(200).json({
            success: true,
            count: books.length,
            total,
            page,
            pages: Math.ceil(total / limit),
            data: books
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single book by ID
// @route   GET /api/books/:id
// @access  Public
exports.getBookById = async (req, res, next) => {
    try {
        const book = await Book.findById(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create a new book
// @route   POST /api/books
// @access  Public
exports.createBook = async (req, res, next) => {
    try {
        const book = await Book.create(req.body);

        res.status(201).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a book
// @route   PUT /api/books/:id
// @access  Public
exports.updateBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: book
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a book
// @route   DELETE /api/books/:id
// @access  Public
exports.deleteBook = async (req, res, next) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);

        if (!book) {
            return res.status(404).json({
                success: false,
                error: 'Book not found'
            });
        }

        res.status(200).json({
            success: true,
            data: {},
            message: 'Book deleted successfully'
        });
    } catch (error) {
        next(error);
    }
};
