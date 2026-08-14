const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
    const header = req.header("authorization");

    // Token missing
    if (!header) {
        return res.status(400).json({
            message: "Token Missing"
        });
    }

    // Authorization: Bearer TOKEN
    const token = header.split(" ")[1];

    try {
        // Verify token
        const decoded = jwt.verify(
            token,
            process.env.JWT_KEY
        );

        // Store decoded user information
        req.user = decoded;

        next();

    } catch (error) {
        return res.status(400).json({
            message: "Invalid Token"
        });
    }
};

module.exports = {
    auth
};