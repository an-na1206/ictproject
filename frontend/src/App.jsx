import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import SummaryCard from './components/SummaryCard';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import ConfirmModal from './components/ConfirmModal';
import Notification from './components/Notification';
import {
  getExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
} from './services/api';
import './App.css';

function App() {
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
  };

  const closeNotification = () => {
    setNotification(null);
  };

  // Load all expenses and compute live total
  const loadExpenses = useCallback(async (isInitial = false) => {
    if (isInitial) setIsLoading(true);
    try {
      const res = await getExpenses();
      if (res && res.success) {
        const data = res.data || [];
        setExpenses(data);
        const total = data.reduce((sum, item) => sum + Number(item.amount || 0), 0);
        setTotalAmount(total);
      } else {
        showNotification('error', res.message || 'Failed to fetch expense records');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      const errMsg = err.response?.data?.message || err.message || 'Cannot reach server. Ensure backend is running.';
      showNotification('error', errMsg);
    } finally {
      if (isInitial) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadExpenses(true);
  }, [loadExpenses]);

  // Handle Add Expense
  const handleAddExpense = async (formData, onSuccess) => {
    setIsSubmitting(true);
    try {
      const res = await createExpense(formData);
      if (res && res.success) {
        showNotification('success', res.message || 'Expense added successfully!');
        if (onSuccess) onSuccess();
        // Automatically refresh without manual page reload
        await loadExpenses(false);
      } else {
        showNotification('error', res.message || 'Unable to add expense');
      }
    } catch (err) {
      console.error('Add expense error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to create expense';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Edit Click
  const handleStartEdit = (expense) => {
    setEditingExpense(expense);
    // Smooth scroll to the form
    const formElem = document.getElementById('expense-form-container');
    if (formElem) {
      formElem.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Handle Cancel Edit
  const handleCancelEdit = () => {
    setEditingExpense(null);
  };

  // Handle Update Expense
  const handleUpdateExpense = async (id, updatedData) => {
    setIsSubmitting(true);
    try {
      const res = await updateExpense(id, updatedData);
      if (res && res.success) {
        showNotification('success', res.message || 'Expense updated successfully!');
        setEditingExpense(null);
        // Automatically refresh without manual page reload
        await loadExpenses(false);
      } else {
        showNotification('error', res.message || 'Unable to update expense');
      }
    } catch (err) {
      console.error('Update expense error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to update expense';
      showNotification('error', msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open Delete Confirm Modal
  const handleOpenDeleteModal = (expense) => {
    setDeletingExpense(expense);
  };

  // Confirm and Execute Deletion
  const handleConfirmDelete = async (id) => {
    setIsDeleting(true);
    try {
      const res = await deleteExpense(id);
      if (res && res.success) {
        showNotification('success', res.message || 'Expense deleted successfully!');
        setDeletingExpense(null);
        // If we were editing this same expense, clear the form
        if (editingExpense && editingExpense._id === id) {
          setEditingExpense(null);
        }
        // Automatically refresh without manual page reload
        await loadExpenses(false);
      } else {
        showNotification('error', res.message || 'Unable to delete expense');
      }
    } catch (err) {
      console.error('Delete expense error:', err);
      const msg = err.response?.data?.message || err.message || 'Failed to delete expense';
      showNotification('error', msg);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="app-layout">
      {/* Top Navbar */}
      <Navbar totalExpenses={expenses.length} totalAmount={totalAmount} />

      {/* Main Container */}
      <main className="main-content">
        {/* Floating Notification */}
        <Notification notification={notification} onClose={closeNotification} />

        {/* Total Amount Spent Summary Card */}
        <SummaryCard totalAmount={totalAmount} expenses={expenses} />

        {/* Content Grid: Form + Expenses List */}
        <div className="dashboard-grid">
          {/* Add / Edit Form Column */}
          <aside className="form-column">
            <ExpenseForm
              onAddExpense={handleAddExpense}
              onUpdateExpense={handleUpdateExpense}
              editingExpense={editingExpense}
              onCancelEdit={handleCancelEdit}
              isSubmitting={isSubmitting}
            />
          </aside>

          {/* Expenses View & Manage Column */}
          <section className="list-column">
            <ExpenseList
              expenses={expenses}
              isLoading={isLoading}
              onEditClick={handleStartEdit}
              onDeleteClick={handleOpenDeleteModal}
              editingExpenseId={editingExpense?._id}
            />
          </section>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deletingExpense)}
        expense={deletingExpense}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingExpense(null)}
        isDeleting={isDeleting}
      />

      <footer className="footer">
        <p>Personal Expense Tracker &copy; {new Date().getFullYear()} • MERN Stack Assessment</p>
      </footer>
    </div>
  );
}

export default App;
