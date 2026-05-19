require("dotenv").config();
const loggerMiddleware = require("./middleware/logger.middleware");

const express = require("express");

const app = express();

app.use(express.json());
app.use(loggerMiddleware);


const transactionsRoutes = require("./routes/transactions.routes");
app.use("/transactions", transactionsRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});