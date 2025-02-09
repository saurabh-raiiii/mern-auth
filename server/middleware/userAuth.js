import jwt from "jsonwebtoken";

const userAuth = (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.json({ success: false, message: "Not Authorized, please log in again" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded || !decoded.id) {
            return res.json({ success: false, message: "Invalid token, please log in again" });
        }

        req.body.userId = decoded.id;

        next();

    } catch (error) {
        return res.json({ success: false, message: "Invalid or expired token, please log in again" });
    }
};

export default userAuth;
