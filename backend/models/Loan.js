const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Loan = sequelize.define('Loan', {
  dueDate: {
    type: DataTypes.DATE,
    allowNull: false
  },
  returnedDate: {
    type: DataTypes.DATE,
    allowNull: true
  }
});

module.exports = Loan;
