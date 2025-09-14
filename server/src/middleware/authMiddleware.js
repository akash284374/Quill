import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("Auth Middleware JWT verify error:", err.message);
      return res.status(401).json({ message: "Invalid token" });
    }

    // Adjust to match how token was signed
    const userId = decoded.id || decoded.userId;
    if (!userId) {
      return res.status(401).json({ message: "Invalid token payload" });
    }

    // Fetch user from DB (exclude sensitive fields)
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profileImage: true,
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
