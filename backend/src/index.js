const testArray = [1, 2, 3];
console.log("Last item:", testArray.at(-1));
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});