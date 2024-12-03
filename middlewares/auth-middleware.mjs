import jwt from "jsonwebtoken";
import "dotenv/config";


export const isAuthenticated = (req, res, next) =>{
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("Unauthorized: Missing or invalid Authorization header");
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    req.user = decoded; // Attach decoded token to `req.user`
    console.log("AUTHORIZED");
    next();
  } catch (error) {
    console.error(`Token verification failed: ${error.message}`);
    return res.status(403).json({ message: "Forbidden: Invalid token" });
  }

}