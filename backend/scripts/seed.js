require('dotenv').config();
const { sequelize, User, Book, Loan } = require('../models');

async function seed() {
  await sequelize.sync({ force: true }); // Reset DB

  // toggle hooks off/on or just use standard create
  const admin = await User.create({
    username: 'admin',
    email: 'admin@library.com',
    password: 'password123',
    role: 'ADMIN'
  });

  const user = await User.create({
    username: 'alice',
    email: 'alice@library.com',
    password: 'password123',
    role: 'USER'
  });

  const user2 = await User.create({
    username: 'bob',
    email: 'bob@library.com',
    password: 'password123',
    role: 'USER'
  });

  const book1 = await Book.create({
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    status: 'AVAILABLE'
  });

  const book2 = await Book.create({
    title: '1984',
    author: 'George Orwell',
    status: 'LOANED'
  });

  await Loan.create({
    userId: user.id,
    bookId: book2.id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
  });

  console.log('Database seeded!');
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
