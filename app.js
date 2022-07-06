require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const auth = require("./middleware/auth");
const cors = require("cors");
var bcrypt = require('bcryptjs');
var jwt = require("jsonwebtoken");

const app = express();

//middleware
app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "50mb" }));

//importing user context
const User = require("./model/user");

//Register
app.post("/register", async (req, res) => {
    try{
        //Get user input
        const { firstName, lastName, email, password } = req.body;

        //Validate user input
        if(!(email && password && firstName && lastName)) {
            res.status(400).send("All input is required");
        };

        //check if user already exists
        //Validate if user exists in our database
        const oldUser = await User.findOne({ email });

        if(oldUser) {
            return res.status(409).send("User Already exists. Please Login 🐶 ");
        }

        //Encrypt user password
        encryptedUserPassword = await bcrypt.hash(password, 10);

        //Create user in our database
        const user = await User.create({
            first_name: firstName,
            last_name: lastName,
            email: email.toLowerCase(),
        });

        //Create token
        const token = jwt.sign(

            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "5h",
            }
        );

        //save user token 
        user.token = token;

        //return new user{ user_id: user._id, email },
        res.status(201).json(user);
    }catch(err){
        console.log(err);
    }
});

//Login
app.post("/login", async (req, res) => {
    try{
        //Get user input
        const { email, password } = req.body;

        ////Validate user input
        if(!(email && password)) {
            res.status(400).send("All input is required 🤣 ")
        }

        //Validate if user exists in database
        const user = await User.findOne({ email });

        if(user && (await bcrypt.compare(password, user.password))){
            //Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "5h",
                }
            );

            //save user token
            user.token = token;

            //user
            return res.status(200).json(user);
        }
        return res.status(400).send("Invalid Credentials 😢...Please Register! ")

    }catch(err){
        console.log(err);
    }
});

//Testing Auth
app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome to Mairura Enterprise 🤝 ")
});

module.exports = app;