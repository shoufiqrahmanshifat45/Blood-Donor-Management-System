import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { getAdminToken, getDonorToken } from './testHelper.js';

describe('Donations Recording & Inventory Verification Endpoints', () => {
  let donorId: string = '';

  test('GET /api/donations rejects unauthenticated request with 401', async () => {
    const res = await request(app).get('/api/donations');
    assert.equal(res.status, 401);
  });

  test('GET /api/donations returns donation logs for authenticated user', async () => {
    const { token } = await getDonorToken();
    const res = await request(app).get('/api/donations').set('Authorization', `Bearer ${token}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
  });

  test('POST /api/donations rejects non-staff/non-admin users with 403', async () => {
    const { token } = await getDonorToken();
    const res = await request(app)
      .post('/api/donations')
      .set('Authorization', `Bearer ${token}`)
      .send({
        donorId: 'sample-donor-id',
        bloodGroup: 'O+',
        units: 1,
        location: 'Dhaka Clinic',
      });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('Insufficient permissions'));
  });

  test('POST /api/donations allows Admin/Staff to record verified donation', async () => {
    // 1. Get an existing donor from directory
    const donorsRes = await request(app).get('/api/donors?limit=1');
    assert.equal(donorsRes.status, 200);
    assert.ok(donorsRes.body.data.length > 0);
    donorId = donorsRes.body.data[0].id;
    const donorBloodGroup = donorsRes.body.data[0].bloodGroup;

    // 2. Record donation with admin credentials
    const adminToken = await getAdminToken();
    const res = await request(app)
      .post('/api/donations')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        donorId,
        bloodGroup: donorBloodGroup,
        units: 1,
        location: 'Central Blood Bank Hospital, Dhaka',
        notes: 'Verified volunteer donation during test run',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.donorId, donorId);
    assert.equal(res.body.data.bloodGroup, donorBloodGroup);
  });
});
