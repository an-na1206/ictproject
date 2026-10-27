const mongoose = require('mongoose');

const ExpenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide an expense title'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    amount: {
      type: Number,
      required: [true, 'Please provide an expense amount'],
      min: [0.01, 'Amount must be greater than zero']
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: {
        values: ['Food', 'Travel', 'Bills', 'Shopping', 'Other'],
        message: '{VALUE} is not a supported category'
      }
    },
    date: {
      type: Date,
      required: [true, 'Please provide an expense date'],
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Expense', ExpenseSchema);
