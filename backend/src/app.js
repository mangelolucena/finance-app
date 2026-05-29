const loggerMiddleware = require("./middleware/logger.middleware");
const transactionsRoutes = require("./routes/transactions.routes");
const categoriesRoutes = require("./routes/categories.routes");
const authRoutes = require("./routes/auth.routes");
const netWorthRoutes = require("./routes/netWorth");


const express = require("express");
const cors = require("cors");

const app = express();

app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);

app.use("/transactions", transactionsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/auth", authRoutes);
app.use("/net-worth", netWorthRoutes);

module.exports = app;