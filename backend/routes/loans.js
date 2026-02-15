const express = require('express');
const router = express.Router();
const { Loan, Book, User } = require('../models');
const { verifyToken } = require('../middleware/auth');

// Create a new loan (Borrow a book)
router.post('/', verifyToken, async (req, res) => {
  try {
    const { bookId } = req.body;
    
    // Check if book exists and is available
    const book = await Book.findByPk(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    if (book.status !== 'AVAILABLE') {
      return res.status(400).json({ message: 'Book is not available' });
    }

    // Calculate due date (14 days from now)
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    // Create loan
    const loan = await Loan.create({
      userId: req.user.id,
      bookId: book.id,
      dueDate: dueDate
    });

    // Update book status
    await book.update({ status: 'LOANED' });

    res.status(201).json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// List my loans
router.get('/', verifyToken, async (req, res) => {
  try {
    const loans = await Loan.findAll({
      where: { userId: req.user.id },
      include: [Book]
    });
    res.json(loans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// FIX #4: IDOR - Remediated
// We verify that the requesting user owns the loan or is an admin.
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const loan = await Loan.findByPk(req.params.id, {
        include: [Book, User]
    });

    if (!loan) {
      return res.status(404).json({ message: 'Loan not found' });
    }

    // AUTH CHECK: Ensure user owns the resource
    if (loan.userId !== req.user.id && req.user.role !== 'ADMIN') {
       return res.status(403).json({ message: 'Unauthorized access to loan details' });
    }

    res.json(loan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
