require("dotenv").config();
const loggerMiddleware = require("./middleware/logger.middleware");
const transactionsRoutes = require("./routes/transactions.routes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);


app.use("/transactions", transactionsRoutes);



const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});