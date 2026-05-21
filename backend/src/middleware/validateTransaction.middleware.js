const validateTransactionMiddleware = (req, res, next) => {
    const {
        user_id,
        amount,
        type,
    } = req.body;


    if (!amount) {
        return res.status(400).json({
            message: "amount is required",
        });
    }

    if (type !== "income" && type !== "expense") {
        return res.status(400).json({
            message: "type must be income or expense",
        });
    }

    next();
};

module.exports = validateTransactionMiddleware;