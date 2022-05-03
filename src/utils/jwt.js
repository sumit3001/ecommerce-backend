import jwt from "jsonwebtoken";

export const singJWT = (payload = {}, expiry = "24h") => {
  try {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: expiry,
    });
    return token;
  } catch (error) {
    return null;
  }
};