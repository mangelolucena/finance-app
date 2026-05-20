
const express = require("express");

const {
    getAllCategories,
} = require("../controllers/categories.controller");

const router = express.Router();

router.get("/all", getAllCategories);

module.exports = router;