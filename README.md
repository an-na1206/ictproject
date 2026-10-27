# Personal Expense Tracker (MERN Stack)

A full-stack web application designed and built with the **MERN Stack** (MongoDB Atlas, Express.js, React.js, Node.js) to record daily expenses and manage them efficiently.

---

## 🚀 Features

- **Summary Dashboard**:
  - Displays **Total Amount Spent** at the top of the page.
  - Live automatic updates whenever an expense is added, edited, or deleted.
  - Real-time category-wise spending breakdown (Food, Travel, Bills, Shopping, Other).
- **Add Expense**:
  - Interactive form with fields: `Title`, `Amount`, `Category`, and `Date`.
  - Comprehensive client & server-side validation (blocks empty values and negative/zero amounts).
  - Clear success and error notifications.
- **View Expenses**:
  - Complete list/table of saved records displaying Title, Amount, Category, and Date.
  - Category badges with dedicated icons.
  - Real-time live filtering by Category and search by title.
  - Sorting options (Newest, Oldest, Highest Amount, Lowest Amount).
  - Automatic refresh after every add, edit, or delete operation without manual page reload.
- **Edit Expense**:
  - Dedicated Edit action on each item.
  - Form pre-fills with existing expense details.
  - Live update in MongoDB Atlas and instant UI synchronization.
  - One-click Cancel Edit option.
- **Delete Expense**:
  - Dedicated Delete option on each item.
  - Modal confirmation dialog before permanent deletion to prevent accidental data loss.
  - Immediate removal from database, list view, and total calculation.
- **UI/UX & Responsiveness**:
  - Clean, attractive modern interface with fluid layout.
  - Fully responsive on both mobile devices (touch-friendly card layout) and desktop screens (structured data table).

---

## 💡 Development Workflow & AI Assistance

In accordance with assessment guidelines permitting up to 50% AI assistance:
- **AI Scaffolding & Copilot (~50%)**: Initial repository scaffolding, baseline REST API route structures, and CSS responsive variable definitions.
- **Developer Implementation (~50%)**: Mongoose schema constraints and validation logic, client-side input validation and error feedback, React state flow and live aggregate total updates, confirmation modal interaction, and responsive testing.

---

## 📁 Repository Structure

```
ictproject/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB Atlas connection handler
│   ├── controllers/
│   │   └── expenseController.js   # CRUD controller & summary calculation
│   ├── models/
│   │   └── Expense.js            # Mongoose schema with validations
│   ├── routes/
│   │   └── expenseRoutes.js      # RESTful API route definitions
│   ├── .env                      # Backend environment configuration
│   ├── .env.example              # Sample environment variables
│   ├── package.json              # Backend dependencies & scripts
│   └── server.js                 # Express application entry point
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ConfirmModal.jsx   # Delete confirmation dialog
│   │   │   ├── ExpenseForm.jsx    # Add & Edit expense form
│   │   │   ├── ExpenseList.jsx    # Table / card expense view with search & filters
│   │   │   ├── Navbar.jsx         # App navigation header
│   │   │   ├── Notification.jsx   # Feedback toast alerts
│   │   │   └── SummaryCard.jsx    # Total amount spent & category pills
│   │   ├── services/
│   │   │   └── api.js            # Axios API client functions
│   │   ├── App.css               # Responsive styling & themes
│   │   ├── App.jsx               # Main application orchestrator
│   │   ├── index.css             # Global typography & CSS variables
│   │   └── main.jsx              # React root mount
│   ├── index.html                # HTML5 entry template
│   ├── package.json              # Frontend dependencies & scripts
│   └── vite.config.js            # Vite build & proxy configuration
├── .env                          # Root environment variables
├── .gitignore                    # Git ignore rules (retaining .env as instructed)
├── package.json                  # Root convenience scripts
└── README.md                     # Full documentation & setup guide
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide React, Axios, CSS3 (Custom Responsive Design)
- **Backend**: Node.js, Express.js, Mongoose, CORS, Morgan, Dotenv
- **Database**: MongoDB Atlas (Cloud NoSQL Database)

---

## ⚙️ Environment Variables

As required by the assessment guidelines, the `.env` file is included in the repository.

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/expense_tracker?retryWrites=true&w=majority
NODE_ENV=development
```

> **Note**: Replace `<username>` and `<password>` with valid credentials from your MongoDB Atlas free-tier cluster. Ensure your IP address is whitelisted in MongoDB Atlas Network Access (`0.0.0.0/0` for universal test access).

---

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18 or higher recommended)
- npm (v9 or higher)

### 1. Clone the Repository
```bash
git clone https://github.com/an-na1206/ictproject.git
cd ictproject
```

### 2. Install Dependencies

#### Install Backend:
```bash
cd backend
npm install
```

#### Install Frontend:
```bash
cd ../frontend
npm install
```

*(Alternatively, run `npm run install-all` from the root directory).*

---

## 🚀 Running the Application

### 1. Start the Backend Server
```bash
cd backend
npm run dev
# or: npm start
```
The backend API server will start on `http://localhost:5000`.

### 2. Start the Frontend Development Server
In a separate terminal:
```bash
cd frontend
npm run dev
```
The React frontend application will launch on `http://localhost:3000`.

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/expenses` | Retrieve all expenses (sorted by date descending) |
| `GET` | `/api/expenses/:id` | Retrieve a single expense by ID |
| `POST` | `/api/expenses` | Create a new expense record |
| `PUT` | `/api/expenses/:id` | Update an existing expense record |
| `DELETE`| `/api/expenses/:id` | Delete an expense record |
| `GET` | `/api/expenses/summary` | Get aggregated total amount and category totals |
| `GET` | `/api/health` | Diagnostic health check (API & Database connection status) |

### Sample Expense Payload
```json
{
  "title": "Grocery Shopping",
  "amount": 75.50,
  "category": "Food",
  "date": "2026-10-27"
}
```

---

## ✅ Submission Checklist Verification

- [x] Repository structure follows `frontend/` and `backend/`.
- [x] `.env` files are included and not excluded by `.gitignore`.
- [x] `package.json` files contain all necessary dependencies.
- [x] Connects to MongoDB Atlas using Mongoose.
- [x] Full CRUD operations (Add, View, Edit, Delete with confirmation).
- [x] Total Amount Spent dynamically updates on every operation without page reload.
- [x] Clean, attractive, mobile and desktop responsive UI/UX.
