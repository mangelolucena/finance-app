const express = require("express");
const validateTransactionMiddleware = require("../middleware/validateTransaction.middleware");
const authMiddleware = require("../middleware/auth.middleware");

const {
    getTransactions,
    createTransaction,
    getTransactionById,
    deleteTransaction,
    updateTransaction,
    getAllCategories,
} = require("../controllers/transactions.controller");

const router = express.Router();

router.get("/", getTransactions);
router.post(
    "/",
    validateTransactionMiddleware,
    createTransaction
);
router.get("/:id", getTransactionById);
router.delete("/:id", deleteTransaction);
router.patch("/:id", updateTransaction);
router.post(
    "/",
    authMiddleware,
    createTransaction
);

module.exports = router;