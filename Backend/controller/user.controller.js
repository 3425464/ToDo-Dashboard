const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if all fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required"
            });
        }

        // Check whether user already exists
        const existing_user = await User.findOne({ email });

        if (existing_user) {
            return res.status(400).json({
                message: "User Already Present in the DB"
            });
        }

        // Encrypt password
        const encrypt_pass = await bcrypt.hash(password, 10);

        // Create new user
        const user = new User({
            name,
            email,
            password: encrypt_pass
        });

        // Save user in MongoDB
        await user.save();

        res.status(201).json({
            message: "Registration Successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        // Compare entered password with encrypted password
        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid Email or Password"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            {
                id: user._id,
                email: user.email
            },
            process.env.JWT_KEY,
            {
                expiresIn: "1d"
            }
        );

        res.status(200).json({
            message: "Login Successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};


module.exports = {
    register,
    login
};