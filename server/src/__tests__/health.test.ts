import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';

describe('Health & Informational Endpoints', () => {
  test('GET / returns 200 and API metadata', async () => {
    const res = await request(app).get('/');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.name);
    assert.ok(Array.isArray(res.body.endpoints));
  });

  test('GET /api/health reports system and database connectivity status', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.status, 'ok');
    assert.equal(res.body.data.database, 'connected');
    assert.ok(res.body.data.timestamp);
    assert.ok(res.body.data.uptime >= 0);
  });

  test('GET /api/unknown-endpoint returns structured 404', async () => {
    const res = await request(app).get('/api/unknown-route-for-testing');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('Route not found'));
    assert.ok(res.body.meta.timestamp);
  });
});
