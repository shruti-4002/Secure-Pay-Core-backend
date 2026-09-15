require('dotenv').config();
const request = require('supertest');
const app = require('../src/app');

describe('APP BASE CONFIGURATION TESTS', () => {

  // 1. Check if server boots up and responds
  test('Should return 404 for undefined routes', async () => {
    const res = await request(app).get('/api/invalid-route-that-does-not-exist');

    expect(res.statusCode).toBe(404);
  });

  // 2. Health check route 
  test('Should handle root or health check endpoint if configured', async () => {
    const res = await request(app).get('/');
    
    // Agar root / route configured hai toh 200/404 me se jo app behaviour ho handle kar lega
    expect([200, 404]).toContain(res.statusCode);
  });

});