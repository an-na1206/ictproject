import React from 'react';
import { DollarSign, TrendingUp, Layers, Utensils, Plane, Receipt, ShoppingBag, MoreHorizontal } from 'lucide-react';

const categoryIcons = {
  Food: <Utensils size={18} />,
  Travel: <Plane size={18} />,
  Bills: <Receipt size={18} />,
  Shopping: <ShoppingBag size={18} />,
  Other: <MoreHorizontal size={18} />,
};

const SummaryCard = ({ totalAmount, expenses }) => {
  // Calculate breakdown per category
  const categoryTotals = expenses.reduce((acc, curr) => {
    const cat = curr.category || 'Other';
    acc[cat] = (acc[cat] || 0) + Number(curr.amount || 0);
    return acc;
  }, {});

  const categories = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

  return (
    <section className="summary-section">
      <div className="summary-main-card">
        <div className="summary-content">
          <div className="summary-header">
            <span className="summary-label">Total Amount Spent</span>
            <div className="summary-icon-pill">
              <TrendingUp size={18} />
              <span>Live Updates</span>
            </div>
          </div>
          <div className="summary-amount-display">
            <span className="currency-symbol">$</span>
            <span className="total-amount-number">
              {Number(totalAmount).toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </span>
          </div>
          <p className="summary-footnote">
            Calculated across {expenses.length} recorded {expenses.length === 1 ? 'transaction' : 'transactions'}
          </p>
        </div>

        <div className="category-pills-row">
          {categories.map((cat) => {
            const amount = categoryTotals[cat] || 0;
            return (
              <div key={cat} className={`cat-pill cat-pill-${cat.toLowerCase()}`}>
                <div className="cat-pill-icon">{categoryIcons[cat]}</div>
                <div className="cat-pill-info">
                  <span className="cat-pill-name">{cat}</span>
                  <span className="cat-pill-value">${amount.toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SummaryCard;
