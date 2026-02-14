const express = require('express');
const router = express.Router();
const { Book, Review, User, sequelize } = require('../models');
const { verifyToken, isAdmin } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');

// VULNERABILITY #5: Insecure File Upload
// No file type validation, no filename randomization
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    // FLAW: Using originalname allows path traversal via filename (if not handled by OS/lib)
    // or overwriting existing files, or double extensions.
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

// List all books (with Vulnerable Search)
router.get('/', async (req, res) => {
  try {
    const { q } = req.query;

    if (q) {
      // VULNERABILITY #1: SQL Injection
      // We are directly inserting the user input 'q' into the SQL string.
      const query = `SELECT * FROM "Books" WHERE title ILIKE '%${q}%' OR author ILIKE '%${q}%'`;
      const books = await sequelize.query(query, {
        model: Book,
        mapToModel: true
      });
      
      // VULNERABILITY #2: Reflected XSS preparation
      // We return the raw input in the message
      return res.json({
        books: books,
        message: `Search results for: <b>${q}</b>` 
      });
    }

    const books = await Book.findAll();
    res.json({ books, message: 'All Books' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create Book (Admin only)
router.post('/', verifyToken, isAdmin, async (req, res) => {
  try {
    const book = await Book.create(req.body);
    res.status(201).json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update Book (Admin only)
router.put('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    await book.update(req.body);
    res.json(book);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete Book (Admin only)
router.delete('/:id', verifyToken, isAdmin, async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    
    await book.destroy();
    res.json({ message: 'Book deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VULNERABILITY #4: Stored XSS
// Add a review to a book
// Upload Book Cover
// VULNERABILITY #5: Insecure File Upload Endpoint
// FLAW: No check on mimetype or extension. Can upload .php, .js, .html etc.
router.post('/:id/cover', verifyToken, upload.single('coverImage'), async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    // Save path relative to root
    book.coverImage = '/uploads/' + req.file.filename;
    await book.save();

    res.json({ message: 'Cover updated', path: book.coverImage });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FLAW: We save the 'content' directly without sanitization.
router.post('/:id/reviews', verifyToken, async (req, res) => {
  const { content, rating } = req.body;
  try {
    // Storing the malicious script
    const review = await Review.create({
      content,
      rating,
      bookId: req.params.id,
      userId: req.user.id
    });
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get reviews for a book
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.findAll({
      where: { bookId: req.params.id },
      include: [User]
    });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
