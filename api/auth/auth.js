import jwt from "jsonwebtoken";

// SCHOOL, STUDENT, TEACHER
export const authMiddleware = (roles = []) => {
  return  async (req, res, next) => {
    try {
      const token = req.header("Authorization")?.replace("Bearer ", "");
      if (!token) return res.status(401).json({ success: false, message: "Authentication denied!!" });
  
      jwt.verify(token, process.env.SECRET_KEY, (err, user) => {

        if (err) return res.status(400).json({ success: false, message: "Invalid Authentication" });
  
        req.user = user;
        if (roles.length > 0 && !roles.includes(req.user.role)) {
          return res.status(403).json({ success: false, message: "You do not have permission to access!" });
        }
        next();
      });
    } catch (error) {
      return res.status(500).json({ success: false, message: error.message });
    }
  };
};