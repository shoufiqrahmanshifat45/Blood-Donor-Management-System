import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { getAdminToken, getDonorToken } from './testHelper.js';

describe('Dashboard, Blood Stock & Scheduling Endpoints', () => {
  test('GET /api/dashboard returns metrics, stock levels, and distribution charts', async () => {
    const res = await request(app).get('/api/dashboard');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data.stats));
    assert.ok(Array.isArray(res.body.data.donorsByBloodGroup));
    assert.ok(Array.isArray(res.body.data.genderDistribution));
    assert.ok(Array.isArray(res.body.data.bloodStock));
    assert.ok(res.body.data.totalDonorsCount);
  });

  test('GET /api/blood-stock returns all 8 blood groups', async () => {
    const res = await request(app).get('/api/blood-stock');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.length, 8);
  });

  test('PATCH /api/blood-stock/:bloodGroup fails validation on invalid blood group', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .patch('/api/blood-stock/INVALID_GROUP')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ deltaUnits: 5 });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.details));
  });

  test('PATCH /api/blood-stock/:bloodGroup requires Staff/Admin authorization', async () => {
    const { token } = await getDonorToken();
    const res = await request(app)
      .patch('/api/blood-stock/O%2B')
      .set('Authorization', `Bearer ${token}`)
      .send({ deltaUnits: 2 });

    assert.equal(res.status, 403);
    assert.equal(res.body.success, false);
  });

  test('PATCH /api/blood-stock/:bloodGroup allows Admin to adjust inventory', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .patch('/api/blood-stock/O%2B')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ deltaUnits: 1 });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data);
  });

  test('Appointments: scheduling and listing works', async () => {
    // 1. Create appointment
    const createRes = await request(app)
      .post('/api/appointments')
      .send({
        donorName: 'Test Appointment Donor',
        donorPhone: '+8801722334455',
        bloodGroup: 'A+',
        appointmentDate: '2026-11-20',
        appointmentTime: '10:00 AM',
        location: 'Blood Center Mirpur',
      });

    assert.equal(createRes.status, 201);
    assert.equal(createRes.body.success, true);
    const appointmentId = createRes.body.data.id;

    // 2. List appointments
    const listRes = await request(app).get('/api/appointments');
    assert.equal(listRes.status, 200);
    assert.equal(listRes.body.success, true);
    assert.ok(Array.isArray(listRes.body.data));

    // 3. Update appointment status
    const updateRes = await request(app)
      .patch(`/api/appointments/${appointmentId}/status`)
      .send({ status: 'Completed' });

    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.data.status, 'Completed');
  });

  test('Notifications: list and mark-all-read work', async () => {
    const res = await request(app).get('/api/notifications');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));

    const markRes = await request(app).post('/api/notifications/mark-all-read');
    assert.equal(markRes.status, 200);
    assert.equal(markRes.body.success, true);
  });
});
