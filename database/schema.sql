-- Create database (SQLite will create the file automatically)
-- Users table
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    monthly_income REAL NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Transactions table
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    amount REAL NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Food','Rent','Transport','Entertainment','Healthcare','Utilities','Shopping','Savings')),
    transaction_date TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('credit','debit')),
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Budgets table
CREATE TABLE IF NOT EXISTS budgets (
    budget_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Food','Rent','Transport','Entertainment','Healthcare','Utilities','Shopping','Savings')),
    budget_limit REAL NOT NULL,
    month INTEGER NOT NULL,
    year INTEGER NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Savings goals table
CREATE TABLE IF NOT EXISTS savings_goals (
    goal_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    goal_name TEXT NOT NULL,
    target_amount REAL NOT NULL,
    saved_amount REAL DEFAULT 0.00,
    deadline TEXT NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Insert sample user
INSERT OR IGNORE INTO users (name, email, monthly_income) VALUES
('John Doe', 'john.doe@example.com', 5000.00);