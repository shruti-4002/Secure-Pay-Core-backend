require('dotenv').config();
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const userModel = require('../src/models/user.model');
const tokenBlacklistModel = require('../src/models/blacklist.model');
const emailQueue = require('../src/queues/email.queue');


// Mock Mailer Service so no real emails are sent during automated testing
jest.mock('../src/queues/email.queue', () => ({
  add: jest.fn().mockResolvedValue({ id: '1' })
}));

jest.setTimeout(30000);

beforeAll(async () => {
  const dbUri = process.env.MONGO_URI ;
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(dbUri);
  }
},30000);

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

describe('AUTH API INTEGRATION TESTS', () => {

  // ==========================================
  // 1. REGISTER TESTS
  // ==========================================
  describe('POST /api/auth/register', () => {

    test('Should register user, set cookie, and call sendWelcomeEmail', async () => {
      const userData = {
        name: 'Shruti',
        email: 'shruti_test_1@example.com',
        password: 'password123'
      };

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body.user).toHaveProperty('_id');
      expect(res.body.user.email).toBe(userData.email);
      expect(res.headers['set-cookie']).toBeDefined();

      
    expect(emailQueue.add).toHaveBeenCalledTimes(1);
      expect(emailQueue.add).toHaveBeenCalledWith(
        'sendEmailJob',
        expect.objectContaining({
          type: 'WELCOME_EMAIL',
          data: expect.objectContaining({
            email: userData.email,
            name: userData.name
          })
        })
      );
    });

    test('Should return 422 if user already exists', async () => {
      const userData = {
        name: 'Shruti',
        email: 'shruti_test_2@example.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(userData);
      jest.clearAllMocks();

      const res = await request(app)
        .post('/api/auth/register')
        .send(userData);

      expect(res.statusCode).toBe(422);
      expect(emailQueue.add).not.toHaveBeenCalled();
    });

  });

  // ==========================================
  // 2. LOGIN TESTS
  // ==========================================
  describe('POST /api/auth/login', () => {

    test('Should login existing user and return auth cookie', async () => {
      const userData = {
        name: 'Shruti',
        email: 'login_test@example.com',
        password: 'password123'
      };

      await request(app).post('/api/auth/register').send(userData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: userData.password
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe('user logged in');
      expect(res.body.user).toHaveProperty('_id');
      expect(res.headers['set-cookie']).toBeDefined();
    });

    test('Should return 401 if email is not registered', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'notfound@example.com',
          password: 'password123'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('email or password invalid');
    });

    test('Should return 401 for wrong password', async () => {
      const userData = {
        name: 'Shruti',
        email: 'login_wrong_pass@example.com',
        password: 'correctpassword'
      };

      await request(app).post('/api/auth/register').send(userData);

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: userData.email,
          password: 'wrongpassword'
        });

      expect(res.statusCode).toBe(401);
      expect(res.body.message).toBe('unarthorized acess');
    });

  });

  // ==========================================
  // 3. LOGOUT TESTS
  // ==========================================
  describe('POST /api/auth/logout', () => {

    test('Should logout user, clear cookie, and blacklist token', async () => {
      const userData = {
        name: 'Shruti',
        email: 'logout_test@example.com',
        password: 'password123'
      };

      // 1. Register
      await request(app).post('/api/auth/register').send(userData);

      // 2. Login & Extract Cookie
      const loginRes = await request(app)
        .post('/api/auth/login')
        .send({ email: userData.email, password: userData.password });

      const cookie = loginRes.headers['set-cookie'];

      // 3. Logout using POST (Matching auth.routes.js)
      const logoutRes = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', cookie);

      expect(logoutRes.statusCode).toBe(200);
      expect(logoutRes.body.message).toBe('User Logged out successfully');

      // 4. Verify token was inserted into blacklist database collection
      const blacklistedCount = await tokenBlacklistModel.countDocuments();
      expect(blacklistedCount).toBe(1);
    });

    test('Should handle logout gracefully when no token is provided', async () => {
      const logoutRes = await request(app).post('/api/auth/logout');

      expect(logoutRes.statusCode).toBe(200);
      expect(logoutRes.body.message).toBe('User Logged out successfully');
    });

  });

});