
-- Create database (run this separately)
-- CREATE DATABASE expense_tracker;

-- Connect to the database before running the below commands
-- \c expense_tracker

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

-- Insert default categories (for demo purposes - these will be copied for each new user)
INSERT INTO categories (name, color, user_id) VALUES
  ('Food', '#FF5733', NULL),
  ('Transportation', '#33FF57', NULL),
  ('Shopping', '#3357FF', NULL),
  ('Entertainment', '#F033FF', NULL),
  ('Bills', '#FF9933', NULL),
  ('Other', '#33FFF9', NULL)
ON CONFLICT DO NOTHING;

