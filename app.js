require("dotenv").config();
require("./config/database").connect();
const express = require("express");

const app = express();

//middleware
app.use(express.json());

//importing user context
const User = require("./model/user");

//Register
app.post("/register", (req, res) => {

});

//Login
app.post("/login", (req, res) => {

});

module.exports = app;