const sequelize = require('../config/database');
const User = require('./User');
const Book = require('./Book');
const Loan = require('./Loan');
const Review = require('./Review');

// Associations
User.hasMany(Loan, { foreignKey: 'userId' });
Loan.belongsTo(User, { foreignKey: 'userId' });

Book.hasMany(Loan, { foreignKey: 'bookId' });
Loan.belongsTo(Book, { foreignKey: 'bookId' });

Book.hasMany(Review, { foreignKey: 'bookId' });
Review.belongsTo(Book, { foreignKey: 'bookId' });

User.hasMany(Review, { foreignKey: 'userId' });
Review.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  Book,
  Loan,
  Review
};
