import React, { useEffect } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

const ConfirmModal = ({ isOpen, expense, onConfirm, onCancel, isDeleting }) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !isDeleting) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel, isDeleting]);

  if (!isOpen || !expense) return null;

  return (
    <div className="modal-backdrop" onClick={!isDeleting ? onCancel : undefined}>
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className="modal-close-btn"
          onClick={onCancel}
          disabled={isDeleting}
          aria-label="Close modal"
        >
          <X size={18} />
        </button>

        <div className="modal-icon-wrapper danger-pulse">
          <AlertTriangle size={28} className="danger-icon" />
        </div>

        <h3 id="modal-title" className="modal-title">
          Confirm Expense Deletion
        </h3>

        <p className="modal-body">
          Are you sure you want to delete <strong className="text-highlight">"{expense.title}"</strong> for{' '}
          <strong>${Number(expense.amount).toFixed(2)}</strong>?
        </p>
        <p className="modal-warning">
          This operation cannot be undone and will permanently remove this record from the database.
        </p>

        <div className="modal-actions">
          <button
            type="button"
            className="btn btn-secondary modal-btn"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger modal-btn"
            onClick={() => onConfirm(expense._id)}
            disabled={isDeleting}
          >
            <Trash2 size={16} />
            <span>{isDeleting ? 'Deleting...' : 'Yes, Delete'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
