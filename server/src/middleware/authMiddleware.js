import jwt from "jsonwebtoken";
import prisma from "../../prisma/index.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded?.userId) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // ✅ Fetch user from DB (exclude sensitive fields)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
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

    // ✅ Attach user to request
    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
