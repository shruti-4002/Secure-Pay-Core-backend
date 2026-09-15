const express=require("express");
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/account.controller")
const router=express.Router();

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new bank account
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [user]
 *             properties:
 *               user:
 *                 type: string
 *     responses:
 *       201:
 *         description: Account created
 *       401:
 *         description: Unauthorized
 */

router.post("/",authMiddleware.authMiddleware,accountController.createAccountController)
/**
 * @swagger
 * /api/accounts/myaccount:
 *   get:
 *     summary: Fetch all accounts belonging to the logged-in user
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts
 */
router.get("/myaccount",authMiddleware.authMiddleware,accountController.getUserAccountController);

/**
 * 
 * GET ALL BALANCE
 */

/**
 * @swagger
 * /api/accounts/accountbalance/{accountId}:
 *   get:
 *     summary: Get balance for a specific account
 *     tags: [Accounts]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Current account balance
 *       404:
 *         description: Account not found
 */

router.get("/accountbalance/:accountId",authMiddleware.authMiddleware,accountController.getAccountBalance);


module.exports=router