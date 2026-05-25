const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db/pool");
const authMiddleware = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const { email, password } = req.body;

        const passwordHash = await bcrypt.hash(password, 10);

        const result = await pool.query(
            `
            INSERT INTO users (email, password_hash)
            VALUES ($1, $2)
            RETURNING id, email;
            `,
            [email, passwordHash]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({
            message: "Failed to register user",
            error: error.message,
        });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query(
            `SELECT * FROM users WHERE email = $1`,
            [email]
        );

        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password_hash
        );

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to login",
            error: error.message,
        });
    }
});

router.delete("/delete", authMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;

        await pool.query(
            `DELETE FROM users WHERE id = $1`,
            [userId]
        );

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: "Failed to delete account",
            error: error instanceof Error ? error.message : String(error),
        });
    }
});

module.exports = router;