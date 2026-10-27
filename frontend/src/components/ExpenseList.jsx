import React, { useState } from 'react';
import {
  Edit2,
  Trash2,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Utensils,
  Plane,
  Receipt,
  ShoppingBag,
  MoreHorizontal,
  Inbox,
} from 'lucide-react';

const categoryIcons = {
  Food: <Utensils size={15} />,
  Travel: <Plane size={15} />,
  Bills: <Receipt size={15} />,
  Shopping: <ShoppingBag size={15} />,
  Other: <MoreHorizontal size={15} />,
};

const ExpenseList = ({
  expenses,
  isLoading,
  onEditClick,
  onDeleteClick,
  editingExpenseId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');

  // Filter and search
  const filteredExpenses = expenses
    .filter((exp) => {
      const matchesSearch = exp.title
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase().trim());
      const matchesCategory =
        selectedCategory === 'All' || exp.category === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      if (sortBy === 'date-desc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'date-asc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'amount-desc') return b.amount - a.amount;
      if (sortBy === 'amount-asc') return a.amount - b.amount;
      return 0;
    });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC', // Ensure consistent date display
    });
  };

  return (
    <div className="card list-card">
      <div className="card-header list-header">
        <div>
          <h2 className="card-title">Expense History</h2>
          <p className="card-subtitle">
            Showing {filteredExpenses.length} of {expenses.length} recorded items
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="controls-row">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by title..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            {searchTerm && (
              <button
                className="clear-search-btn"
                onClick={() => setSearchTerm('')}
                title="Clear search"
              >
                &times;
              </button>
            )}
          </div>

          <div className="filter-wrapper">
            <Filter size={16} className="filter-icon" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="category-filter-select"
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Travel">Travel</option>
              <option value="Bills">Bills</option>
              <option value="Shopping">Shopping</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="sort-wrapper">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="sort-select"
              aria-label="Sort expenses"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option>
              <option value="amount-asc">Lowest Amount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading expense records...</p>
        </div>
      ) : filteredExpenses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon-wrap">
            <Inbox size={42} />
          </div>
          <h3>No expenses found</h3>
          <p>
            {expenses.length === 0
              ? 'No expense entries yet. Add your first expense using the form above!'
              : 'No expenses match your search or filter criteria.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop Table View */}
          <div className="table-responsive desktop-only">
            <table className="expenses-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Date</th>
                  <th className="text-right">Amount</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredExpenses.map((exp) => {
                  const isEditing = editingExpenseId === exp._id;
                  return (
                    <tr
                      key={exp._id}
                      className={`expense-row ${isEditing ? 'row-editing' : ''}`}
                    >
                      <td className="expense-title-cell">
                        <span className="expense-title-text">{exp.title}</span>
                      </td>
                      <td>
                        <span className={`category-tag tag-${exp.category?.toLowerCase() || 'other'}`}>
                          {categoryIcons[exp.category] || <MoreHorizontal size={14} />}
                          <span>{exp.category}</span>
                        </span>
                      </td>
                      <td className="expense-date-cell">
                        <span className="date-badge">
                          <Calendar size={13} />
                          {formatDate(exp.date)}
                        </span>
                      </td>
                      <td className="text-right expense-amount-cell">
                        <span className="amount-value">
                          ${Number(exp.amount).toFixed(2)}
                        </span>
                      </td>
                      <td className="text-center actions-cell">
                        <div className="actions-group">
                          <button
                            type="button"
                            className="btn-action btn-edit"
                            onClick={() => onEditClick(exp)}
                            title="Edit this expense"
                            aria-label={`Edit ${exp.title}`}
                          >
                            <Edit2 size={16} />
                            <span className="action-label">Edit</span>
                          </button>
                          <button
                            type="button"
                            className="btn-action btn-delete"
                            onClick={() => onDeleteClick(exp)}
                            title="Delete this expense"
                            aria-label={`Delete ${exp.title}`}
                          >
                            <Trash2 size={16} />
                            <span className="action-label">Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="mobile-cards-list mobile-only">
            {filteredExpenses.map((exp) => {
              const isEditing = editingExpenseId === exp._id;
              return (
                <div
                  key={exp._id}
                  className={`mobile-expense-card ${isEditing ? 'card-editing' : ''}`}
                >
                  <div className="mobile-card-top">
                    <div>
                      <h4 className="mobile-expense-title">{exp.title}</h4>
                      <div className="mobile-expense-date">
                        <Calendar size={13} />
                        <span>{formatDate(exp.date)}</span>
                      </div>
                    </div>
                    <div className="mobile-expense-amount">
                      ${Number(exp.amount).toFixed(2)}
                    </div>
                  </div>

                  <div className="mobile-card-bottom">
                    <span className={`category-tag tag-${exp.category?.toLowerCase() || 'other'}`}>
                      {categoryIcons[exp.category] || <MoreHorizontal size={14} />}
                      <span>{exp.category}</span>
                    </span>

                    <div className="mobile-actions">
                      <button
                        type="button"
                        className="btn-action btn-edit"
                        onClick={() => onEditClick(exp)}
                        aria-label={`Edit ${exp.title}`}
                      >
                        <Edit2 size={15} />
                        <span>Edit</span>
                      </button>
                      <button
                        type="button"
                        className="btn-action btn-delete"
                        onClick={() => onDeleteClick(exp)}
                        aria-label={`Delete ${exp.title}`}
                      >
                        <Trash2 size={15} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default ExpenseList;
