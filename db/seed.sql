-- =====================================
-- USERS
-- =====================================

INSERT INTO users (email, password_hash)
VALUES (
    'angelo@test.com',
    'hashedpassword123'
);


-- =====================================
-- CATEGORIES
-- =====================================

INSERT INTO categories (user_id, name)
VALUES
('YOUR_USER_ID', 'Food'),
('YOUR_USER_ID', 'Transport'),
('YOUR_USER_ID', 'Salary');


-- =====================================
-- TRANSACTIONS
-- =====================================

INSERT INTO transactions (
    user_id,
    category_id,
    amount,
    type,
    description
)
VALUES
(
    'YOUR_USER_ID',
    'FOOD_CATEGORY_ID',
    250.00,
    'expense',
    'Jollibee lunch'
),
(
    'YOUR_USER_ID',
    'TRANSPORT_CATEGORY_ID',
    120.00,
    'expense',
    'Grab ride'
),
(
    'YOUR_USER_ID',
    'SALARY_CATEGORY_ID',
    50000.00,
    'income',
    'Monthly salary'
);