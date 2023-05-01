const { verify } = require("jsonwebtoken");

const validateToken = (req, res, next) => {
    const authHeader = req.header("accessToken");
    const accessToken = authHeader && authHeader.replace(/"/g, "");

    if (!accessToken) return res.status(401).json({ error: "Access Token Missing!" });

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

// Both above and below methods work depending on how the headers are setup through the requests

// const jwt = require("jsonwebtoken");

// function validateToken(req, res, next) {
//     const authHeader = req.header("accessToken");
//     //   const token1 = authHeader && authHeader.split(" ")[1];
//     const token = authHeader && authHeader.replace(/"/g, "");


//     if (!token) {
//         return res.status(401).json({ message: "Access token missing" });
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.jwtkey);

//         req.user = decoded;
//         next();
//     } catch (err) {
//         console.log(err);
//         return res.status(403).json({ message: "Invalid access token" });
//     }
// }

// module.exports = { validateToken };