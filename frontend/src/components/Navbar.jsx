import React from 'react';
import { Wallet, ShieldCheck } from 'lucide-react';

const Navbar = ({ totalExpenses, totalAmount }) => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="logo-icon-wrapper">
            <Wallet className="logo-icon" size={26} />
          </div>
          <div>
            <h1 className="navbar-title">ExpenseFlow</h1>
            <p className="navbar-subtitle">Personal Expense Tracker • MERN</p>
          </div>
        </div>
        <div className="navbar-stats">
          <div className="navbar-badge">
            <span className="badge-dot"></span>
            <span>{totalExpenses} {totalExpenses === 1 ? 'Expense' : 'Expenses'}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
