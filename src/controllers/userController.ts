import { NextFunction, Request, Response } from "express";
import UserService from "../services/userServices";
import createHttpError from "http-errors";
import { ERROR_CODES } from "../utils/errorCodes";
import { sendResponse } from "../utils/responseHandler";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { addToBlacklist } from "../utils/manageToken";
import { Config } from "../config";

class UserController {
  async createUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let userExists = await UserService.getUserByEmail(req.body.email);
      if (userExists) {
        sendResponse(res, ERROR_CODES.CONFLICT, false, "User already exists");
        return;
      }
      if (req.body.password !== req.body.confirm_password) {
        sendResponse(
          res,
          ERROR_CODES.BAD_REQUEST,
          false,
          "Passwords do not match"
        );
        return;
      }
      let userData = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phone: req.body.phone,
        bio: req.body.bio,
        photo: req.body.photo,
        visibility: req.body.visibility,
        admin: req.body.admin,
      });
      let createUser = await UserService.createUser(userData);
      if (!createUser) {
        sendResponse(
          res,
          ERROR_CODES.INTERNAL_SERVER_ERROR,
          false,
          "Error registering user"
        );
        return;
      }
      sendResponse(
        res,
        ERROR_CODES.RESOURCE_CREATED,
        true,
        "User created successfully",
        createUser
      );
      return;
    } catch (err: Error | unknown) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
  async createSession(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      let user = await UserService.getUserByEmail(req.body.email);
      let validPassword;
      if (user) {
        validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
          sendResponse(
            res,
            ERROR_CODES.UNAUTHORIZED,
            false,
            "Password is incorrect"
          );
          return;
        }
        if (Config.JWT_SECRET) {
          const token = jwt.sign(user.toJSON(), Config.JWT_SECRET, {
            expiresIn: "300000",
          });
          sendResponse(
            res,
            ERROR_CODES.STATUS_OK,
            true,
            "Sign in  Successfull,here is your token, please keep it safe",
            token
          );
          return;
        }
      }
      sendResponse(res, ERROR_CODES.NOT_FOUND, false, "User not found");
      return;
    } catch (err: Error | unknown) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await addToBlacklist(req.body.token);

      sendResponse(res, ERROR_CODES.STATUS_OK, true, "Logged out successfully");
      return;
    } catch (err) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
  async getProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const getUserExists = await UserService.getUserById(req.body.userId);
      if (getUserExists && req.body.userId !== req.params.id) {
        sendResponse(
          res,
          ERROR_CODES.UNAUTHORIZED,
          false,
          "Please login to view profile"
        );
        return;
      }
      const userData = await UserService.getUserById(req.params.id);
      if (!userData) {
        sendResponse(res, ERROR_CODES.NOT_FOUND, false, "User not found");
        return;
      }
      sendResponse(
        res,
        ERROR_CODES.STATUS_OK,
        true,
        "User details fetched successfully",
        userData
      );
      return;
    } catch (err) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const getUserExists = await UserService.getUserById(req.body.userId);
      if (getUserExists && req.body.userId !== req.params.id) {
        sendResponse(
          res,
          ERROR_CODES.UNAUTHORIZED,
          false,
          "Please login to update profile"
        );
        return;
      }
      const updateUser = await UserService.updateUser(req.params.id, req.body);
      if (!updateUser) {
        sendResponse(res, ERROR_CODES.NOT_FOUND, false, "User not found");
        return;
      }
      sendResponse(
        res,
        ERROR_CODES.STATUS_OK,
        true,
        "User updated successfully",
        updateUser
      );
    } catch (err) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
  async getAllProfiles(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const getUserExists = await UserService.getUserById(req.body.userId);
      if (!getUserExists) {
        sendResponse(
          res,
          ERROR_CODES.UNAUTHORIZED,
          false,
          "Please login to update profile"
        );
        return;
      }
      if (getUserExists?.admin == true) {
        const userData = await UserService.getAllUsers();
        sendResponse(
          res,
          ERROR_CODES.STATUS_OK,
          true,
          "User details fetched successfully",
          userData
        );
        return;
      } else {
        const userData = await UserService.getAllUsersWithCondition(
          getUserExists?.admin
        );
        sendResponse(
          res,
          ERROR_CODES.STATUS_OK,
          true,
          "User details fetched successfully",
          userData
        );
        return;
      }
    } catch (err) {
      const error = createHttpError(
        ERROR_CODES.INTERNAL_SERVER_ERROR,
        "Internal Server Error: "
      );
      return next(error);
    }
  }
}

export default new UserController();
