const Expense = require('../models/Expense');
const mongoose = require('mongoose');

// Fetch all expenses sorted by most recent date
exports.getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1, createdAt: -1 });
    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve expenses from database',
      error: error.message
    });
  }
};

// Fetch single expense record by ID
exports.getExpenseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    const expense = await Expense.findById(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching expense',
      error: error.message
    });
  }
};

// Create a new expense record with input validation
exports.createExpense = async (req, res) => {
  try {
    const { title, amount, category, date } = req.body;

    // Validate title
    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide an expense title'
      });
    }

    // Validate amount (must be positive number)
    const parsedAmount = Number(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      });
    }

    // Validate category
    const validCategories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];
    if (!category || !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    // Validate date
    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an expense date'
      });
    }

    const newExpense = await Expense.create({
      title: title.trim(),
      amount: parsedAmount,
      category,
      date: new Date(date)
    });

    return res.status(201).json({
      success: true,
      message: 'Expense added successfully',
      data: newExpense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to save expense',
      error: error.message
    });
  }
};

// Update an existing expense record
exports.updateExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    const { title, amount, category, date } = req.body;

    if (title !== undefined && (!title || title.trim() === '')) {
      return res.status(400).json({
        success: false,
        message: 'Title cannot be empty'
      });
    }

    if (amount !== undefined) {
      const parsedAmount = Number(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be a positive number'
        });
      }
    }

    const validCategories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];
    if (category !== undefined && !validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: `Category must be one of: ${validCategories.join(', ')}`
      });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title.trim();
    if (amount !== undefined) updateData.amount = Number(amount);
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = new Date(date);

    const updatedExpense = await Expense.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: 'Expense record not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expense updated successfully',
      data: updatedExpense
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', ')
      });
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to update expense',
      error: error.message
    });
  }
};

// Delete expense by ID
exports.deleteExpense = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid expense ID'
      });
    }

    const expense = await Expense.findByIdAndDelete(id);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: 'Expense not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Expense deleted successfully',
      data: expense
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete expense',
      error: error.message
    });
  }
};

// Calculate summary (total amount spent and breakdown by category)
exports.getExpenseSummary = async (req, res) => {
  try {
    const summary = await Expense.aggregate([
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      }
    ]);

    const categorySummary = await Expense.aggregate([
      {
        $group: {
          _id: '$category',
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    const totalAmount = summary.length > 0 ? summary[0].totalAmount : 0;
    const totalCount = summary.length > 0 ? summary[0].count : 0;

    return res.status(200).json({
      success: true,
      data: {
        totalAmount,
        totalCount,
        categorySummary
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to calculate expense summary',
      error: error.message
    });
  }
};
