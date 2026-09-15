const express=require("express");
const  authMiddleware=require("../middleware/auth.middleware")
const transactionController=require("../controllers/transaction.controller");
const router=express.Router();


/**
 * -POST/api/transactions/
 * -Create a new transaction
 */
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Execute atomic funds transfer between accounts
 *     tags: [Transactions]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [fromAccount, toAccount, amount, idempotencyKey]
 *             properties:
 *               fromAccount:
 *                 type: string
 *               toAccount:
 *                 type: string
 *               amount:
 *                 type: number
 *               idempotencyKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction Successful
 *       400:
 *         description: Bad request or Insufficient balance
 *       429:
 *         description: Account locked / Concurrent transaction in progress
 */

router.post("/",authMiddleware.authMiddleware,transactionController.createtransaction)
/**
 * @swagger
 * /api/transactions/system/initial-funds:
 *   post:
 *     summary: Seed initial funds via system user
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [toAccount, amount, idempotencyKey]
 *             properties:
 *               toAccount:
 *                 type: string
 *               amount:
 *                 type: number
 *               idempotencyKey:
 *                 type: string
 *     responses:
 *       201:
 *         description: Initial funds seeded successfully
 */
router.post("/system/initial-funds",authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)



module.exports=router