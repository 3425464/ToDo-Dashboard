const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({
                message: "Authentication token is required"
            });
        }

        if (!header.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Invalid authorization format"
            });
        }

        const token = header.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Authentication token is required"
            });
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_KEY
        );

        req.user = decoded;

        next();

    } catch (error) {
        console.error("Authentication error:", error.message);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};

module.exports = {
    auth
};