const pool = require("../db/pool");

const getAllCategories = async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT id, name
            FROM categories
            ORDER BY name ASC
        `);

        res.json(result.rows);

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch categories",
            error: error.message,
        });
    }
};

module.exports = {
    getAllCategories,
};