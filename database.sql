
-- Create database (run this separately)
-- CREATE DATABASE expense_tracker;

-- Connect to the database before running the below commands
-- \c expense_tracker

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  amount DECIMAL(10, 2) NOT NULL,
  description VARCHAR(255) NOT NULL,
  date DATE NOT NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL
);

-- Insert default categories (same as in our React app)
INSERT INTO categories (name, color) VALUES
  ('Food', '#FF5733'),
  ('Transportation', '#33FF57'),
  ('Shopping', '#3357FF'),
  ('Entertainment', '#F033FF'),
  ('Bills', '#FF9933'),
  ('Other', '#33FFF9')
ON CONFLICT DO NOTHING;
