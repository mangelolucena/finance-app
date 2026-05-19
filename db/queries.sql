-- =====================================
-- VIEW ALL TABLES
-- =====================================

-- View all users
SELECT * FROM users;

-- View all categories
SELECT * FROM categories;

-- View all transactions
SELECT * FROM transactions;


-- =====================================
-- JOINS
-- =====================================

-- Your first JOIN
SELECT
    t.amount,
    t.type,
    t.description,
    c.name AS category_name,
    t.transaction_date
FROM transactions t
JOIN categories c
ON t.category_id = c.id;


-- =====================================
-- ANALYTICS
-- =====================================

-- Total expenses
SELECT SUM(amount)
FROM transactions
WHERE type = 'expense';


-- Total income
SELECT SUM(amount)
FROM transactions
WHERE type = 'income';


-- Expenses by category
SELECT
    c.name AS category_name,
    SUM(t.amount) AS total_expenses
FROM transactions t
JOIN categories c
ON t.category_id = c.id
WHERE t.type = 'expense'
GROUP BY c.name;