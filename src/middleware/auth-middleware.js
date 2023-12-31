import { prismaClient } from "../application/database.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");

  if (!token) {
    res.status(401).json({ errors: "Token required, Access Forbidden !" }).end();
  } else {
    const user = await prismaClient.user.findFirst({ where: { token } });

    if (!user) {
      res.status(401).json({ errors: "User not found, Access Forbidden !" }).end();
    } else {
      req.user = user;

      next();
    }
  }
};
