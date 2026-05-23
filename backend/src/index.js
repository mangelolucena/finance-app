require("dotenv").config();

const loggerMiddleware = require("./middleware/logger.middleware");
const transactionsRoutes = require("./routes/transactions.routes");
const categoriesRoutes = require("./routes/categories.routes");
const authRoutes = require("./routes/auth.routes");

const express = require("express");
const cors = require("cors");




const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);


app.use("/transactions", transactionsRoutes);
app.use("/categories", categoriesRoutes);
app.use("/auth", authRoutes);
app.get("/health", (req, res) => {
    res.json({ status: "ok" });
});


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});