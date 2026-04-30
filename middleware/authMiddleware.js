import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            return res.status(401).json({
                message: "No token, authorization denied"
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = decoded; // 🔥 attach user

        next(); // 🔥 continue to controller

    } catch (error) {
        return res.status(401).json({
            message: "Token is not valid"
        });
    }
};

export default authMiddleware;