const express = require("express");

const {
    getTransactions,
    createTransaction,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
} = require("../controllers/transactions.controller");

const router = express.Router();

router.get("/", getTransactions);
router.post("/", createTransaction);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);

module.exports = router;