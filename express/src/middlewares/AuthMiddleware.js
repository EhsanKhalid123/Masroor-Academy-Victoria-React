const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const authHeader = req.header("accessToken");
    const accessToken = authHeader && authHeader.replace(/"/g, "");

    if (!accessToken) return res.status(404).json({ error: "Invalid Request!" });

    try {
        const decodedToken = verify(accessToken, process.env.jwtkey);

        if (decodedToken) {
            return next();
        }
    } catch (error) {
        return res.status(403).json({ error: "Invalid Access Token!" });
    }
}

module.exports = { validateToken };
