import { Router } from "express";
import UserController from "../controllers/userController";
import passport from "passport";
import { authenticate } from "../middleware/authenticate";
import userController from "../controllers/userController";

const router = Router();
/**
 * @swagger
 * /api/v1/users/register:
 *   post:
 *     summary: To register a user
 *     description: Register User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               photo:
 *                 type: string
 *               visibility:
 *                 type: string
 *               admin:
 *                type: boolean
 *     responses:
 *       '200':
 *         description: A successful response
 *       '409':
 *         description: A user Already exists
 *       '400':
 *         description: Passwords do not match
 *       '500':
 *         description: Internal server error
 *       '201':
 *         description: A user created
 */
router.post("/register", UserController.createUser);
/**
 * @swagger
 * /api/v1/users/login:
 *   post:
 *     summary: To logging into user account
 *     description: User sign-in
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       '200':
 *         description: A successful response
 *       '404':
 *         description: A user not found
 *       '401':
 *         description: Passwords is incorrect
 *       '500':
 *         description: Internal server error
 */
router.post("/login", UserController.createSession);
/**
 * @swagger
 * /api/v1/users/logout:
 *   get:
 *     summary: To logout from user account
 *     description: User sign-out
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       '200':
 *         description: Successfully logged out
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     ApiKeyAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

router.get("/logout", UserController.logout);
/**
 * @swagger
 * /api/v1/users/profile/{id}:
 *   get:
 *     summary: Get user profile by ID
 *     description: Retrieve a user profile by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     security:
 *       - HeaderAuth: []
 *     responses:
 *       '200':
 *         description: User profile retrieved successfully
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     HeaderAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

router.get("/profile/:id", authenticate, UserController.getProfile);
/**
 * @swagger
 * /api/v1/users/update/{id}:
 *   patch:
 *     summary: Update user profile by ID
 *     description: Update user profile by ID with provided data
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               confirm_password:
 *                 type: string
 *               phone:
 *                 type: string
 *               bio:
 *                 type: string
 *               photo:
 *                 type: string
 *               visibility:
 *                 type: string
 *               admin:
 *                 type: boolean
 *     security:
 *       - HeaderAuth: []
 *     responses:
 *       '200':
 *         description: User profile updated successfully
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     HeaderAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

router.patch("/update/:id", authenticate, userController.updateProfile);
/**
 * @swagger
 * /api/v1/users/all-profiles:
 *   get:
 *     summary: Get user profiles based on user role
 *     description: Retrieve all user profiles based on role
 *     security:
 *       - HeaderAuth: []
 *     responses:
 *       '200':
 *         description: User profiles retrieved successfully based on logged in user
 *       '401':
 *         description: Unauthorized, missing or invalid token
 *       '500':
 *         description: Internal server error
 *
 * components:
 *   securitySchemes:
 *     HeaderAuth:
 *       type: apiKey
 *       in: header
 *       name: Authorization
 */

router.get("/all-profiles", authenticate, userController.getAllProfiles);
export default router;
