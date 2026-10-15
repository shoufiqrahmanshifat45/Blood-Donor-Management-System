import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import { app } from '../app.js';
import { getAdminToken, getDonorToken } from './testHelper.js';

describe('Blood Requests Endpoints', () => {
  let createdRequestId: string = '';

  test('GET /api/blood-requests returns list of requests', async () => {
    const res = await request(app).get('/api/blood-requests');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.meta);
  });

  test('POST /api/blood-requests validates request payload', async () => {
    const res = await request(app)
      .post('/api/blood-requests')
      .send({
        patientName: '',
        bloodGroup: 'INVALID',
        units: 0,
      });

    assert.equal(res.status, 400);
    assert.equal(res.body.success, false);
    assert.ok(Array.isArray(res.body.details));
  });

  test('POST /api/blood-requests creates a new blood requisition', async () => {
    const res = await request(app)
      .post('/api/blood-requests')
      .send({
        patientName: 'Test Emergency Patient',
        hospital: 'United Hospital Dhaka',
        bloodGroup: 'AB+',
        units: 2,
        urgency: 'Urgent',
        contactPhone: '+8801811223344',
        contactName: 'Attendant Brother',
        notes: 'Required before tomorrow morning',
      });

    assert.equal(res.status, 201);
    assert.equal(res.body.success, true);
    assert.ok(res.body.data.id);
    assert.equal(res.body.data.patientName, 'Test Emergency Patient');
    assert.equal(res.body.data.bloodGroup, 'AB+');
    assert.equal(res.body.data.urgency, 'Urgent');

    createdRequestId = res.body.data.id;
  });

  test('GET /api/blood-requests/:id returns single request details', async () => {
    const res = await request(app).get(`/api/blood-requests/${createdRequestId}`);
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.id, createdRequestId);
    assert.equal(res.body.data.hospital, 'United Hospital Dhaka');
  });

  test('PATCH /api/blood-requests/:id/status updates request status', async () => {
    const res = await request(app)
      .patch(`/api/blood-requests/${createdRequestId}/status`)
      .send({
        status: 'Fulfilled',
      });

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.equal(res.body.data.urgency, 'Fulfilled');
  });

  test('DELETE /api/blood-requests/:id deletes blood request by Admin', async () => {
    const adminToken = await getAdminToken();
    const res = await request(app)
      .delete(`/api/blood-requests/${createdRequestId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
  });
});
