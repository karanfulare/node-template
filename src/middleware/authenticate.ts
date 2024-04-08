import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseHandler";
import { ERROR_CODES } from "../utils/errorCodes";
import createHttpError from "http-errors";
import { logger } from "../config/logger";
import { isTokenBlacklisted } from "../utils/manageToken";
import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Config } from "../config";
// This is just a placeholder for your actual blacklist implementation

async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const token = req.headers.authorization;
  if (!token) {
    sendResponse(
      res,
      ERROR_CODES.UNAUTHORIZED,
      false,
      "Unauthorized: No token provided"
    );
    return;
  }

  try {
    // Check if the token is blacklisted
    const blacklisted = await isTokenBlacklisted(token);
    if (blacklisted) {
      sendResponse(
        res,
        ERROR_CODES.UNAUTHORIZED,
        false,
        "Unauthorized: Token has been revoked"
      );
      return;
    }
    if (Config.JWT_SECRET) {
      const decodedToken = jwt.verify(token, Config.JWT_SECRET) as {
        _id: string;
      }; // Assuming your JWT payload includes the user ID

      // Pass the user ID to the route
      console.log(decodedToken);
      req.body.userId = decodedToken._id;

      // Token is valid, continue with next middleware
      next();
    }
  } catch (err) {
    // logger.error("Error during token validation:", err);
    if (err instanceof TokenExpiredError) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Token expired: "
      );
      return next(error);
    } else {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Error during token validation: "
      );
      return next(error);
    }
  }
}

export { authenticate };
