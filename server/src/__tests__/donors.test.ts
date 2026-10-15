import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { getAdminToken, getDonorToken } from './testHelper.js';

describe('Donors Directory & Management Endpoints', () => {
  let createdDonorId: string = '';
  const uniquePhone = `+88019${Math.floor(10000000 + Math.random() * 90000000)}`;

  test('GET /api/donors returns donor directory with pagination', async () => {
    const res = await request(app).get('/api/donors');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.meta);
    assert.ok(res.body.meta.total >= 0);
  });

  test('GET /api/donors?bloodGroup=O+ filters by blood group', async () => {
    const res = await request(app).get('/api/donors?bloodGroup=O%2B');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    for (const donor of res.body.data) {
      assert.equal(donor.bloodGroup, 'O+');
    }
  });

  test('POST /api/donors validates required fields and types', async () => {
    const res = await request(app)
      .post('/api/donors')
      .send({
        name: 'Incomplete Donor',
        bloodGroup: 'INVALID',
        age: 15, // under 18
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.details));
  });

  test('POST /api/donors creates a new donor successfully', async () => {
    const res = await request(app)
      .post('/api/donors')
      .send({
        name: 'Farhan Kabir',
        bloodGroup: 'B+',
        gender: 'Male',
        age: 26,
        phone: uniquePhone,
        email: 'farhan.kabir@example.com',
        district: 'Dhaka',
        thana: 'Mirpur',
        address: 'House 42, Road 9, Mirpur-10',
        isAvailable: true,
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.name, 'Farhan Kabir');
    assert.equal(res.body.data.bloodGroup, 'B+');

    createdDonorId = res.body.data.id;
  });

  test('GET /api/donors/:id redacts private donor data for unauthenticated public requests', async () => {
    const res = await request(app).get(`/api/donors/${createdDonorId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, createdDonorId);
    assert.equal(res.body.data.name, 'Farhan Kabir');
    // PRIVACY VERIFICATION: Private address & user linkage are redacted for public
    assert.equal(res.body.data.address, null);
    assert.equal(res.body.data.userId, null);
    assert.equal(res.body.data.ineligibilityReason, null);
    // Email must be masked
    assert.ok(res.body.data.email.includes('***'));
    assert.ok(Array.isArray(res.body.data.donations));
  });

  test('GET /api/donors/:id exposes full private data for authorized Admin requests', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .get(`/api/donors/${createdDonorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    // PRIVACY VERIFICATION: Full address & unmasked email exposed to Admin
    assert.equal(res.body.data.address, 'House 42, Road 9, Mirpur-10');
    assert.equal(res.body.data.email, 'farhan.kabir@example.com');
  });

  test('GET /api/donors/:id with non-existent ID returns 404', async () => {
    const res = await request(app).get('/api/donors/non-existent-donor-id-xyz');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('not found'));
  });

  test('PATCH /api/donors/:id rejects unauthorized donor update with 403', async () => {
    // Normal donor user attempts to edit Farhan Kabir's donor record
    const { token } = await getDonorToken();
    const res = await request(app)
      .patch(`/api/donors/${createdDonorId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        district: 'Chittagong',
      });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
    assert.ok(res.body.error.includes('permission'));
  });

  test('PATCH /api/donors/:id allows Admin to update any donor profile', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .patch(`/api/donors/${createdDonorId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        district: 'Sylhet',
        status: 'Eligible',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.district, 'Sylhet');
  });

  test('DELETE /api/donors/:id denies deletion to non-admin users with 403', async () => {
    const { token } = await getDonorToken();
    const res = await request(app)
      .delete(`/api/donors/${createdDonorId}`)
      .set('Authorization', `Bearer ${token}`);

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
  });

  test('DELETE /api/donors/:id allows Admin deletion', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .delete(`/api/donors/${createdDonorId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.message.includes('deleted'));
  });
});
