const pool = require("../db/pool");

const getTransactions = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                t.id,
                t.amount,
                t.type,
                t.description,
                t.transaction_date,
                c.id AS category_id,
                c.name AS category_name
            FROM transactions t
            LEFT JOIN categories c
            ON t.category_id = c.id
            ORDER BY t.transaction_date DESC;
        `);

        res.json(result.rows);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transactions",
            error: error.message,
        });
    }
};

const createTransaction = async (req, res) => {
    try {
        const {
            user_id,
            category_id,
            amount,
            type,
            description,
            transaction_date,
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO transactions (
                user_id,
                category_id,
                amount,
                type,
                description,
                transaction_date
            )
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
            `,
            [user_id, category_id, amount, type, description, transaction_date]
        );

        res.status(201).json(result.rows[0]);

    } catch (error) {
        res.status(500).json({
            message: "Failed to create transaction",
            error: error.message,
        });
    }
};

const getTransactionById = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            SELECT
                t.id,
                t.amount,
                t.type,
                t.description,
                t.transaction_date,
                c.name AS category_name,
                c.id AS category_id
            FROM transactions t
            LEFT JOIN categories c
            ON t.category_id = c.id
            WHERE t.id = $1
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch transaction",
            error: error.message,
        });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM transactions
            WHERE id = $1
            RETURNING *;
            `,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({
            message: "Transaction deleted successfully",
            transaction: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete transaction",
            error: error.message,
        });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const { category_id, amount, type, description, transaction_date } = req.body;

        const result = await pool.query(
            `
            UPDATE transactions
            SET
                category_id = $1,
                amount = $2,
                type = $3,
                description = $4,
                transaction_date = $5
            WHERE id = $6
            RETURNING *;
            `,
            [category_id, amount, type, description, transaction_date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Transaction not found" });
        }

        res.json({
            message: "Transaction updated successfully",
            transaction: result.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update transaction",
            error: error.message,
        });
    }
};


module.exports = {
    getTransactions,
    createTransaction,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
};