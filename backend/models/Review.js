const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Review = sequelize.define('Review', {
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: { min: 1, max: 5 }
  }
});

module.exports = Review;
