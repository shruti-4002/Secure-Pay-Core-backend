const express=require("express");
const authController=require("../controllers/auth.controllers");
const router=express.Router()


/*
  Good practice: all auth routes under /api/auth
  1. /register
  2. /login
*/

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       422:
 *         description: User already exists
 */


router.post("/register",authController.userRegisterController)
/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login existing user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful and returns auth cookie
 *       401:
 *         description: Invalid credentials
 */
router.post("/login",authController.userLoginController);
/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Logout user and blacklist token
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out successfully
 */
router.post("/logout",authController.userLogoutController);


module.exports=router