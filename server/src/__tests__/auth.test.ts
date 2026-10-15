import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { getAdminToken } from './testHelper.js';

describe('Authentication & User Management Endpoints', () => {
  const randomSuffix = Math.floor(Math.random() * 100000);
  const testUser = {
    name: `Test User ${randomSuffix}`,
    email: `testuser_${randomSuffix}@example.com`,
    password: 'Password123!@#',
    phone: `+8801700${randomSuffix.toString().padStart(6, '0')}`,
  };

  let registeredToken: string = '';

  test('POST /api/auth/register fails validation with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Bad Email User',
        email: 'invalid-email-address',
        password: 'Password123!',
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('validation'));
    assert.ok(Array.isArray(res.body.details));
  });

  test('POST /api/auth/register succeeds and does not return password hash', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.ok(res.body.data.user.id);
    assert.equal(res.body.data.user.email, testUser.email.toLowerCase());
    // STRICT CHECK: Password must NEVER be returned in response
    assert.equal((res.body.data.user as any).password, undefined);
    assert.equal((res.body.data.user as any).passwordHash, undefined);

    registeredToken = res.body.data.token;
  });

  test('POST /api/auth/register rejects duplicate email with 409 Conflict', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    assert.equal(res.status, 409);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('already exists'));
  });

  test('POST /api/auth/login succeeds with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password,
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.token);
    assert.equal(res.body.data.user.email, testUser.email.toLowerCase());
    assert.equal((res.body.data.user as any).password, undefined);
  });

  test('POST /api/auth/login fails with 401 on incorrect password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'WrongPassword!',
      });

    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('Invalid email or password'));
  });

  test('GET /api/auth/me fails with 401 when no token is provided', async () => {
    const res = await request(app).get('/api/auth/me');
    assert.equal(res.status, 401);
    assert.equal(res.body.success, false);
  });

  test('GET /api/auth/me succeeds with valid Bearer token', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${registeredToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.email, testUser.email.toLowerCase());
    assert.equal((res.body.data as any).password, undefined);
  });

  test('PATCH /api/auth/profile updates profile fields', async () => {
    const res = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${registeredToken}`)
      .send({
        name: 'Updated Name',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.name, 'Updated Name');
  });

  test('POST /api/auth/logout succeeds', async () => {
    const res = await request(app).post('/api/auth/logout');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});
