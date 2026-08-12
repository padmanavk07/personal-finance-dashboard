# 📊 Personal Finance Dashboard

A full-stack web application designed to help students and professionals track expenses, manage monthly budgets, and visualize their spending habits in real-time.


*View the live demo here: https://personal-finance-dashboard-seven-sand.vercel.app/ *

## ✨ Features

* **Secure Authentication:** User registration and login utilizing JSON Web Tokens (JWT).
* **Transaction Management:** Easily add, view, and delete daily income and expenses with automatic categorization.
* **Dynamic Budgeting:** Set monthly budget limits and track your remaining balance via an adaptive, color-coded progress bar.
* **Data Visualization:** Interactive analytics utilizing Recharts (Pie charts for categories, Bar charts for weekly spending, Line charts for income vs. expense trends).
* **Responsive Design:** A custom, mobile-friendly UI utilizing CSS Grid and Flexbox for a seamless experience on any device.

## 🛠️ Tech Stack

**Frontend:**
* React 18 (Bootstrapped with Vite)
* React Router v6 (Routing & Protected Routes)
* React Hook Form (Form State Management)
* Recharts (Data Visualization)
* Lucide React (Iconography)
* Custom CSS3

**Backend:**
* Python 3 & Flask (REST API)
* Flask-SQLAlchemy (ORM)
* Flask-JWT-Extended (Authentication)
* SQLite (Local Development) / PostgreSQL (Production)

## 🚀 Local Setup & Installation

Follow these steps to run the project locally on your machine.

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher)
* [Python](https://www.python.org/downloads/) (v3.9 or higher)
* Git

### 1. Clone the Repository

git clone [https://github.com/yourusername/finance-dashboard.git](https://github.com/padmanavk07/personal-finance-dashboard.git)
cd finance-dashboard


### 2. Backend Setup

Navigate to the backend directory, set up a virtual environment, and install dependencies:

cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

Create a `.env` file inside the `backend/` directory:

SECRET_KEY=your_super_secret_key
JWT_SECRET_KEY=your_super_secret_jwt_key
SQLALCHEMY_DATABASE_URI=sqlite:///finance.db

Start the Flask server:

python app.py

*The API will run on `http://127.0.0.1:5000`

### 3. Frontend Setup

Open a **new terminal window**, navigate to the frontend directory, and install the Node modules:

cd frontend

# Install dependencies
npm install


Create a `.env` file inside the `frontend/` directory (if you want to point to a local API explicitly):

VITE_API_URL=[http://127.0.0.1:5000/api](http://127.0.0.1:5000/api)


Start the Vite development server:

npm run dev


*The app will be running at `http://localhost:5173` (or the port Vite provides).*


## 📂 Project Structure

finance-dashboard/
├── backend/
│   ├── app.py             # Main entry point & factory
│   ├── auth.py            # Authentication routes (JWT)
│   ├── routes.py          # Transactions, Budget, and Dashboard endpoints
│   ├── models.py          # SQLAlchemy database schemas
│   ├── database.py        # Database initialization
│   ├── config.py          # Environment variables config
│   └── requirements.txt
│
└── frontend/
    ├── src/
    │   ├── components/    # Reusable UI (Layout, Table, Forms, DashboardCards)
    │   ├── pages/         # Route views (Login, Register, Dashboard, Analytics, etc.)
    │   ├── services/      # Axios API configuration & interceptors
    │   ├── App.jsx        # App router and protected route wrapper
    │   ├── main.jsx       # React DOM root
    │   └── index.css      # Custom global styling and layout system
    └── package.json


## 🔮 Future Roadmap

* [ ] Natural Language Entry (e.g., "Spent ₹250 on lunch yesterday" using AI).
* [ ] Recurring transactions and subscription tracking.
* [ ] Dark mode toggle.
* [ ] Export transaction history to CSV/PDF.

## 🤝 Contact

Created by Padmanav Khamari - feel free to contact me at padmanav.k.07@outlook.com