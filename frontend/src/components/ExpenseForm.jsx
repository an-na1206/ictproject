import React, { useState, useEffect } from 'react';
import { PlusCircle, CheckCircle, XCircle, DollarSign, Tag, Calendar, Edit3, X } from 'lucide-react';

const CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

const ExpenseForm = ({ onAddExpense, onUpdateExpense, editingExpense, onCancelEdit, isSubmitting }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingExpense) {
      setFormData({
        title: editingExpense.title || '',
        amount: editingExpense.amount || '',
        category: editingExpense.category || 'Food',
        date: editingExpense.date ? new Date(editingExpense.date).toISOString().split('T')[0] : '',
      });
      setErrors({});
    } else {
      setFormData({
        title: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0],
      });
      setErrors({});
    }
  }, [editingExpense]);

  const validate = () => {
    const errs = {};
    if (!formData.title || formData.title.trim() === '') {
      errs.title = 'Title is required';
    } else if (formData.title.trim().length > 100) {
      errs.title = 'Title must be 100 characters or fewer';
    }

    if (!formData.amount || formData.amount === '') {
      errs.amount = 'Amount is required';
    } else {
      const parsed = parseFloat(formData.amount);
      if (isNaN(parsed) || parsed <= 0) {
        errs.amount = 'Amount must be greater than zero';
      }
    }

    if (!formData.category || !CATEGORIES.includes(formData.category)) {
      errs.category = 'Please choose a valid category';
    }

    if (!formData.date) {
      errs.date = 'Date is required';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const payload = {
      title: formData.title.trim(),
      amount: parseFloat(formData.amount),
      category: formData.category,
      date: formData.date,
    };

    if (editingExpense) {
      onUpdateExpense(editingExpense._id, payload);
    } else {
      onAddExpense(payload, () => {
        // Reset form on success
        setFormData({
          title: '',
          amount: '',
          category: 'Food',
          date: new Date().toISOString().split('T')[0],
        });
        setErrors({});
      });
    }
  };

  return (
    <div className={`card form-card ${editingExpense ? 'editing-mode' : ''}`} id="expense-form-container">
      <div className="card-header">
        <div className="card-header-icon">
          {editingExpense ? <Edit3 size={20} className="icon-accent" /> : <PlusCircle size={20} className="icon-accent" />}
        </div>
        <div>
          <h2 className="card-title">
            {editingExpense ? 'Edit Expense Record' : 'Record New Expense'}
          </h2>
          <p className="card-subtitle">
            {editingExpense
              ? 'Update the fields below to modify this record'
              : 'Enter expense details to log your daily transactions'}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} noValidate className="expense-form">
        <div className="form-grid">
          {/* Title Field */}
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Expense Title <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g., Grocery Shopping, Metro Pass"
                value={formData.title}
                onChange={handleChange}
                className={`form-input ${errors.title ? 'input-error' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.title && <span className="error-text">{errors.title}</span>}
          </div>

          {/* Amount Field */}
          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount ($) <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <div className="input-prefix">
                <DollarSign size={16} />
              </div>
              <input
                type="number"
                id="amount"
                name="amount"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={formData.amount}
                onChange={handleChange}
                className={`form-input has-prefix ${errors.amount ? 'input-error' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.amount && <span className="error-text">{errors.amount}</span>}
          </div>

          {/* Category Field */}
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <div className="input-prefix">
                <Tag size={16} />
              </div>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`form-input form-select has-prefix ${errors.category ? 'input-error' : ''}`}
                disabled={isSubmitting}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            {errors.category && <span className="error-text">{errors.category}</span>}
          </div>

          {/* Date Field */}
          <div className="form-group">
            <label htmlFor="date" className="form-label">
              Date <span className="required-star">*</span>
            </label>
            <div className="input-with-icon">
              <div className="input-prefix">
                <Calendar size={16} />
              </div>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`form-input has-prefix ${errors.date ? 'input-error' : ''}`}
                disabled={isSubmitting}
              />
            </div>
            {errors.date && <span className="error-text">{errors.date}</span>}
          </div>
        </div>

        {/* Buttons */}
        <div className="form-actions">
          {editingExpense && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onCancelEdit}
              disabled={isSubmitting}
            >
              <X size={16} />
              <span>Cancel</span>
            </button>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {editingExpense ? (
              <>
                <CheckCircle size={18} />
                <span>{isSubmitting ? 'Updating...' : 'Update Expense'}</span>
              </>
            ) : (
              <>
                <PlusCircle size={18} />
                <span>{isSubmitting ? 'Adding...' : 'Add Expense'}</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;
