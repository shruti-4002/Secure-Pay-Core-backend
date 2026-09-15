require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const userModel = require('../src/models/user.model');
const accountModel = require('../src/models/account.model');


// Mock Mailer 
jest.mock('../src/utils/mailer', () => ({
  sendWelcomeEmail: jest.fn().mockResolvedValue(true),
  sendTransactionEmail: jest.fn().mockResolvedValue(true),
  sendTransactionFailureEmail: jest.fn().mockResolvedValue(true)
}));


beforeAll(async () => {
  const dbUri = process.env.MONGO_URI 
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
});

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

describe('ACCOUNT API INTEGRATION TESTS', () => {

  // Helper function to create a logged-in user and return their cookie & user details
  const getAuthenticatedUser = async () => {
    const userData = {
      name: 'Account Tester',
      email: 'account_tester@example.com',
      password: 'password123'
    };

    await request(app).post('/api/auth/register').send(userData);

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: userData.email, password: userData.password });

    const cookie = loginRes.headers['set-cookie'];
    const user = loginRes.body.user;

    return { cookie, user };
  };

  // ==========================================
  // 1. CREATE ACCOUNT TESTS
  // ==========================================
  describe('POST /api/accounts/', () => {

    test('Should create a new account for an authenticated user', async () => {
      const { cookie, user } = await getAuthenticatedUser();

      const res = await request(app)
        .post('/api/accounts')
        .set('Cookie', cookie)
        .send({ user: user._id });

      expect(res.statusCode).toBe(201);
      expect(res.body.account).toHaveProperty('_id');
      expect(res.body.account.user).toBe(user._id);
    });

    test('Should reject account creation if user is not logged in', async () => {
      const res = await request(app)
        .post('/api/accounts')
        .send({ user: 'dummy_user_id' });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toContain('Unauthorized');
    });

  });

  // ==========================================
  // 2. GET USER ACCOUNTS TESTS
  // ==========================================
  describe('GET /api/accounts/myaccount', () => {

    test('Should fetch all accounts belonging to the logged-in user', async () => {
      const { cookie, user } = await getAuthenticatedUser();

      // Seed 2 accounts for this user directly in DB
      await accountModel.create({ user: user._id });
      await accountModel.create({ user: user._id });

      const res = await request(app)
        .get('/api/accounts/myaccount')
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body.accountlist)).toBe(true);
      expect(res.body.accountlist.length).toBe(2);
    });

  });

  // ==========================================
  // 3. GET ACCOUNT BALANCE TESTS
  // ==========================================
  describe('GET /api/accounts/accountbalance/:accountId', () => {

    test('Should fetch account balance for valid accountId owned by user', async () => {
      const { cookie, user } = await getAuthenticatedUser();

      // Create an account for this user
      const newAccount = await accountModel.create({ user: user._id });

      const res = await request(app)
        .get(`/api/accounts/accountbalance/${newAccount._id}`)
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(200);
      expect(res.body.accountId).toBe(newAccount._id.toString());
      expect(res.body).toHaveProperty('balance');
    });

    test('Should return 404 if accountId does not exist or belong to another user', async () => {
      const { cookie } = await getAuthenticatedUser();
      const nonExistentAccountId = new mongoose.Types.ObjectId();

      const res = await request(app)
        .get(`/api/accounts/accountbalance/${nonExistentAccountId}`)
        .set('Cookie', cookie);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe('Account not found');
    });

  });

});