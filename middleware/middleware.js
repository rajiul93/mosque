import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const authorization = req.headers.authorization; 
 
  const token = authorization?.split(" ")[1];
  console.log(token);
  try {
    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    jwt.verify(token, "secret", (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      } else {
        req.phone = decoded;
       console.log(decoded);
        next();
      }
    });
  } catch (error) {
    return res.status(403).json({ message: "Token missing" });
  }
};
