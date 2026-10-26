const jwt = require("jsonwebtoken");
const User = require("../models/User");

async function protect(req, res, next) {
  const authorization = req.headers.authorization || "";
  const token = authorization.startsWith("Bearer ") ? authorization.split(" ")[1] : null;

  if (!token) {
    return res.status(401).json({ message: "Authentication is required for this action." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user || !user.isActive) {
      return res.status(401).json({ message: "This account is unavailable." });
    }
    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Your session is invalid or has expired." });
  }
}

module.exports = { protect };
