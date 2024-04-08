import express, { NextFunction, Request, Response } from "express";
import { logger } from "./config/logger";
import createHttpError, { HttpError } from "http-errors";
import { ERROR_CODES } from "./utils/errorCodes";
import { sendResponse } from "./utils/responseHandler";
import db from "./config/mongoose";
import UserRoutes from "./routes/userRoutes";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import axios from "axios";
import MongoStore from "connect-mongo";
import { Config } from "./config";
const app = express();
db();
// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/require-await

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    name: "user-auth",
    secret: "somethingwentwrong-bhbhjbhjbgv",
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create({
      mongoUrl: Config.MONGO_URL,
      autoRemove: "disabled",
    }),
  })
);
app.get("/", async (req, res, next) => {
  // return sendResponse(
  //   res,
  //   ERROR_CODES.STATUS_OK,
  //   true,
  //   "Welcome to the API server"
  // );
  const error = createHttpError(
    ERROR_CODES.INTERNAL_SERVER_ERROR,
    "Internal Server Error: "
  );
  next(error);
});
app.get("/auth/google", (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${Config.cID}&redirect_uri=${Config.CB}&response_type=code&scope=profile email`;
  res.redirect(url);
});

// Callback URL for handling the Google Login response
app.get("/auth/google/callback", async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange authorization code for access token
    const { data } = await axios.post("https://oauth2.googleapis.com/token", {
      client_id: Config.cID,
      client_secret: Config.Secret,
      code,
      redirect_uri: Config.CB,
      grant_type: "authorization_code",
    });
    const { access_token, id_token } = data;

    // Use access_token or id_token to fetch user profile
    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: { Authorization: `Bearer ${access_token}` },
      }
    );
    res.setHeader("access_token", access_token);
    // Code to handle user authentication and retrieval using the profile data

    res.redirect("/");
  } catch (error) {
    console.error("Error:", error);
    res.redirect("api/v1/users/login");
  }
});

app.use("/api/v1/users", UserRoutes);
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  logger.error(err.message);
  const statusCode = err.statusCode | ERROR_CODES.UNAUTHORIZED;

  res.status(statusCode).json({
    errors: [
      {
        type: err.name,
        msg: err.message,
        path: req.path,
        location: req.originalUrl,
      },
    ],
  });
});

export default app;
