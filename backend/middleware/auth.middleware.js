import jwt from "jsonwebtoken"
import User from "../models/user.js"
export const protect = async (req, res, next) => {
  let token = req.headers.authorization;

  if (token && token.startsWith("Bearer")) {
    try {
      token = token.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");
      next();

    } catch (error) {
     
      return res.status(401).json({
        message: "Session expired. Please login again.",
        
      });
    }
  } else {
    res.status(401).json({ message: "No token provided" });
  }
};
