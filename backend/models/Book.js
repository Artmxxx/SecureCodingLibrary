const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Book = sequelize.define('Book', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  author: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT
  },
  status: {
    type: DataTypes.ENUM('AVAILABLE', 'LOANED'),
    defaultValue: 'AVAILABLE'
  },
  coverImage: {
    type: DataTypes.STRING // Path to uploaded file
  }
});

module.exports = Book;
