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
     
      return res.status(404).json({
        status:false,
        message: "Session expired. Please login again.",
        
      });
    }
  } else {
    res.status(404).json({ status:false, message: "No token provided" });
  }
};
