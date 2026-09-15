require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const accountModel = require('../src/models/account.model');
const transactionModel = require('../src/models/transaction.model');
const ledgerModel = require('../src/models/ledger.model');
const emailQueue = require('../src/queues/email.queue');

// Mock Mailer Service
jest.mock('../src/queues/email.queue', () => ({
  add: jest.fn().mockResolvedValue({ id: '1' })
}));

jest.setTimeout(30000);

beforeAll(async () => {
  const dbUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/banking_ledger_test';
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
}, 30000);

beforeEach(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
  jest.clearAllMocks();
});

afterAll(async () => {
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
  await mongoose.connection.close();
});

describe('TRANSACTION API INTEGRATION TESTS', () => {

  // Helper function to register and authenticate a user
  const getAuthenticatedUser = async (email, name = 'Test User') => {
    const userData = { name, email, password: 'password123' };
    await request(app).post('/api/auth/register').send(userData);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });

    const cookie = loginRes.headers['set-cookie'];
    const user = loginRes.body.user;

    return { cookie, user };
  };

  // Helper function to seed balance for an account via Ledger
  const seedAccountBalance = async (accountId, amount) => {
    await ledgerModel.create({
      account: accountId,
      amount: amount,
      type: 'CREDIT'
    });
  };

  // ==========================================
  // 1. CREATE TRANSACTION TESTS
  // ==========================================
  describe('POST /api/transactions/', () => {

    test('Should execute transaction successfully and record DEBIT/CREDIT ledger entries', async () => {
      const sender = await getAuthenticatedUser('sender@example.com', 'Sender User');
      const receiver = await getAuthenticatedUser('receiver@example.com', 'Receiver User');

      // Create ACTIVE accounts for both
      const fromAcc = await accountModel.create({ user: sender.user._id, status: 'ACTIVE', isLocked: false });
      const toAcc = await accountModel.create({ user: receiver.user._id, status: 'ACTIVE', isLocked: false });

      // Seed 500 initial balance in sender account
      await seedAccountBalance(fromAcc._id, 500);

      const payload = {
        fromAccount: fromAcc._id.toString(),
        toAccount: toAcc._id.toString(),
        amount: 200,
        idempotencyKey: 'idempotency-key-001'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Cookie', sender.cookie)
        .send(payload);

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe('Transaction Successful');

      // Verify transaction state in Database
      const tx = await transactionModel.findOne({ idempotencyKey: payload.idempotencyKey });
      expect(tx).not.toBeNull();
      expect(tx.status).toBe('COMPLETED');

      // Verify Ledger entries created
      const ledgers = await ledgerModel.find({ account: fromAcc._id });
      expect(ledgers.length).toBe(2); // 1 seed CREDIT + 1 DEBIT

      // Verify email notification trigger (handles multiple queued calls cleanly)
      expect(emailQueue.add).toHaveBeenCalled();
      
      const successEmailCalls = emailQueue.add.mock.calls.filter(call => 
        call[0] === 'sendEmailJob' && 
        call[1].type === 'TRANSACTION_SUCCESS' &&
        call[1].data.amount === 200
      );
      
      expect(successEmailCalls.length).toBeGreaterThanOrEqual(1);
    });

    test('Should reject transaction when required fields are missing', async () => {
      const { cookie } = await getAuthenticatedUser('user_invalid@example.com');

      const res = await request(app)
        .post('/api/transactions')
        .set('Cookie', cookie)
        .send({ amount: 100 });

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toBe('FromAccount, toAccount, amount and idempotencyKey are required');
    });

    test('Should reject transaction if sender has insufficient balance', async () => {
      const sender = await getAuthenticatedUser('poor_sender@example.com');
      const receiver = await getAuthenticatedUser('rich_receiver@example.com');

      const fromAcc = await accountModel.create({ user: sender.user._id, status: 'ACTIVE', isLocked: false });
      const toAcc = await accountModel.create({ user: receiver.user._id, status: 'ACTIVE', isLocked: false });

      // Seed only 50 balance
      await seedAccountBalance(fromAcc._id, 50);

      const payload = {
        fromAccount: fromAcc._id.toString(),
        toAccount: toAcc._id.toString(),
        amount: 500, // Requesting more than available
        idempotencyKey: 'idempotency-key-insufficient'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Cookie', sender.cookie)
        .send(payload);

      expect(res.statusCode).toBe(400);
      expect(res.body.message).toContain('Insufficient Balance');
    });

    test('Should handle idempotency for already COMPLETED transaction', async () => {
      const sender = await getAuthenticatedUser('idempotent_sender@example.com');
      const receiver = await getAuthenticatedUser('idempotent_receiver@example.com');

      const fromAcc = await accountModel.create({ user: sender.user._id, status: 'ACTIVE', isLocked: false });
      const toAcc = await accountModel.create({ user: receiver.user._id, status: 'ACTIVE', isLocked: false });

      await seedAccountBalance(fromAcc._id, 1000);

      const payload = {
        fromAccount: fromAcc._id.toString(),
        toAccount: toAcc._id.toString(),
        amount: 100,
        idempotencyKey: 'same-key-twice'
      };

      // First Request
      await request(app)
        .post('/api/transactions')
        .set('Cookie', sender.cookie)
        .send(payload);

      // Duplicate Request with identical key
      const duplicateRes = await request(app)
        .post('/api/transactions')
        .set('Cookie', sender.cookie)
        .send(payload);

      expect(duplicateRes.statusCode).toBe(200);
      expect(duplicateRes.body.message).toBe('Transaction already processed');
    });

    test('Should return 429 when account is locked by another concurrent transaction', async () => {
      const sender = await getAuthenticatedUser('locked_sender@example.com');
      const receiver = await getAuthenticatedUser('locked_receiver@example.com');

      // Pre-lock account manually (`isLocked: true`)
      const fromAcc = await accountModel.create({ user: sender.user._id, status: 'ACTIVE', isLocked: true });
      const toAcc = await accountModel.create({ user: receiver.user._id, status: 'ACTIVE', isLocked: false });

      await seedAccountBalance(fromAcc._id, 1000);

      const payload = {
        fromAccount: fromAcc._id.toString(),
        toAccount: toAcc._id.toString(),
        amount: 100,
        idempotencyKey: 'concurrent-lock-key'
      };

      const res = await request(app)
        .post('/api/transactions')
        .set('Cookie', sender.cookie)
        .send(payload);

      expect(res.statusCode).toBe(429);
      expect(res.body.message).toContain('your account is busy');
    });

  });

});