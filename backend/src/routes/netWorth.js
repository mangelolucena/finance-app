const express = require("express");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        const itemsResult = await pool.query(
            `
            SELECT *
            FROM net_worth_items
            WHERE user_id = $1
            ORDER BY created_at DESC
            `,
            [userId]
        );

        const summaryResult = await pool.query(
            `
            SELECT
                COALESCE(
                    SUM(CASE WHEN type = 'asset' THEN amount ELSE 0 END),
                    0
                ) AS total_assets,

                COALESCE(
                    SUM(CASE WHEN type = 'liability' THEN amount ELSE 0 END),
                    0
                ) AS total_liabilities,

                COALESCE(
                    SUM(CASE WHEN type = 'asset' THEN amount ELSE -amount END),
                    0
                ) AS net_worth

            FROM net_worth_items
            WHERE user_id = $1
            `,
            [userId]
        );

        res.json({
            items: itemsResult.rows,
            summary: summaryResult.rows[0],
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch net worth",
            error: error.message,
        });
    }
});

router.post("/", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;

        const {
            name,
            type,
            category,
            amount,
        } = req.body;

        const result = await pool.query(
            `
            INSERT INTO net_worth_items (
                user_id,
                name,
                type,
                category,
                amount
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
            `,
            [
                userId,
                name,
                type,
                category,
                amount,
            ]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to create net worth item",
            error: error.message,
        });
    }
});

router.delete("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;

        const result = await pool.query(
            `
            DELETE FROM net_worth_items
            WHERE id = $1 AND user_id = $2
            RETURNING *
            `,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Net worth item not found",
            });
        }

        res.json({
            message: "Net worth item deleted",
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete net worth item",
            error: error.message,
        });
    }
});

router.put("/:id", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId;
        const { id } = req.params;
        const {
            name,
            type,
            category,
            amount,
        } = req.body;

        const result = await pool.query(
          `
          UPDATE net_worth_items
          SET
              name = $1,
              type = $2,
              category = $3,
              amount = $4,
              updated_at = NOW()
          WHERE id = $5 AND user_id = $6
          RETURNING *
          `,
          [
              name,
              type,
              category,
              amount,
              id,
              userId,
          ]
      );

        if (result.rowCount === 0) {
            return res.status(404).json({
                message: "Net worth item not found",
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to update net worth item",
            error: error.message,
        });
    }
});

module.exports = router;