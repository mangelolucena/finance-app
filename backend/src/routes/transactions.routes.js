const express = require("express");
const validateTransactionMiddleware = require("../middleware/validateTransaction.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const {
    getTransactions,
    createTransaction,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
} = require("../controllers/transactions.controller");

const router = express.Router();

router.get("/", authMiddleware, getTransactions);
router.post(
    "/",
    authMiddleware,
    validateTransactionMiddleware,
    createTransaction
);
router.get("/:id", authMiddleware, getTransactionById);
router.delete("/:id", authMiddleware, deleteTransaction);
router.patch("/:id", authMiddleware, updateTransaction);

module.exports = router;