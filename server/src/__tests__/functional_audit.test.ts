import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import bcrypt from 'bcryptjs';
import { app } from '../app.js';
import { prisma } from '../db/prisma.js';

describe('Master Prompt Comprehensive End-to-End Functional Audit', () => {
  const timestamp = Date.now();
  const testPhone = `+880171${String(timestamp).slice(-7)}`;
  const secondPhone = `+880172${String(timestamp).slice(-7)}`;

  let userToken: string = '';
  let userId: string = '';
  let secondUserToken: string = '';
  let secondUserId: string = '';

  // =========================================================================
  // PHASE 2 & 11: Member Profile Updates & Deep Persistence
  // =========================================================================
  test('E2E Member Profile: Full registration, donor linking, updating, and persistence', async () => {
    // 1. Register a fresh general member
    const regRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Audit Member',
        email: `audit_member_${timestamp}@example.com`,
        password: 'SecurePassword123!',
        phone: testPhone,
      });

    assert.equal(regRes.status, 201);
    assert.ok(regRes.body.data.token);
    userToken = regRes.body.data.token;
    userId = regRes.body.data.user.id;

    // 2. Initially, user has no donorProfile
    const initialMe = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(initialMe.status, 200);
    assert.equal(initialMe.body.data.donorProfile, null);

    // 3. User updates their profile and provides donor information
    const updateRes = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        name: 'Audit Member Updated',
        phone: testPhone,
        donor: {
          bloodGroup: 'B+',
          gender: 'Female',
          age: 26,
          district: 'Chattogram',
          thana: 'Panchlaish',
          totalDonations: 3,
          readyForEmergency: true,
          isAvailable: true,
        },
      });

    assert.equal(updateRes.status, 200);
    assert.equal(updateRes.body.success, true);
    assert.ok(updateRes.body.data.donorProfile);
    assert.equal(updateRes.body.data.donorProfile.bloodGroup, 'B+');
    assert.equal(updateRes.body.data.donorProfile.gender, 'Female');
    assert.equal(updateRes.body.data.donorProfile.district, 'Chattogram');
    assert.equal(updateRes.body.data.donorProfile.thana, 'Panchlaish');
    assert.equal(updateRes.body.data.donorProfile.totalDonations, 3);

    // 4. VERIFY DIRECTLY AGAINST REAL DATABASE RECORD
    const dbDonor = await prisma.donor.findUnique({
      where: { userId },
    });
    assert.ok(dbDonor, 'Donor record must be persisted in database table');
    assert.equal(dbDonor.name, 'Audit Member Updated');
    assert.equal(dbDonor.phone, testPhone);
    assert.equal(dbDonor.district, 'Chattogram');
    assert.equal(dbDonor.totalDonations, 3);

    // 5. Query /api/auth/me again to ensure converted enums and values persist across page reloads
    const reloadedMe = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    assert.equal(reloadedMe.status, 200);
    assert.equal(reloadedMe.body.data.name, 'Audit Member Updated');
    assert.equal(reloadedMe.body.data.donorProfile.bloodGroup, 'B+');
    assert.equal(reloadedMe.body.data.donorProfile.gender, 'Female');
    assert.equal(reloadedMe.body.data.donorProfile.status, 'Eligible');

    // 6. Partial update preserving existing fields
    const partialUpdate = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        donor: {
          age: 27,
          totalDonations: 4,
        },
      });
    assert.equal(partialUpdate.status, 200);
    assert.equal(partialUpdate.body.data.donorProfile.age, 27);
    assert.equal(partialUpdate.body.data.donorProfile.totalDonations, 4);
    // Preserved fields
    assert.equal(partialUpdate.body.data.donorProfile.district, 'Chattogram');
    assert.equal(partialUpdate.body.data.donorProfile.bloodGroup, 'B+');

    // 7. Security: Users cannot elevate role to ADMIN via profile update
    const exploitRoleRes = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        role: 'SUPER_ADMIN',
      });
    assert.equal(exploitRoleRes.status, 200);
    assert.notEqual(exploitRoleRes.body.data.role, 'SUPER_ADMIN');
    assert.equal(exploitRoleRes.body.data.role, 'DONOR');
  });

  // =========================================================================
  // PHASE 3: Voluntary Donor Registration & Duplicate Prevention
  // =========================================================================
  test('E2E Donor Registration: Validation, duplicate conflict, and persistence', async () => {
    // 1. Register a public voluntary donor
    const createDonorRes = await request(app)
      .post('/api/donors')
      .send({
        name: 'Public Voluntary Donor',
        bloodGroup: 'AB+',
        gender: 'Male',
        age: 29,
        phone: secondPhone,
        district: 'Rajshahi',
        thana: 'Boalia',
        totalDonations: 1,
      });

    assert.equal(createDonorRes.status, 201);
    assert.equal(createDonorRes.body.success, true);
    assert.equal(createDonorRes.body.data.bloodGroup, 'AB+');
    assert.equal(createDonorRes.body.data.phone, secondPhone);

    // 2. Database persistence check
    const donorDb = await prisma.donor.findUnique({
      where: { phone: secondPhone },
    });
    assert.ok(donorDb);
    assert.equal(donorDb.name, 'Public Voluntary Donor');

    // 3. Duplicate phone registration must return 409 Conflict
    const dupRes = await request(app)
      .post('/api/donors')
      .send({
        name: 'Duplicate Phone Submitter',
        bloodGroup: 'O+',
        gender: 'Male',
        age: 30,
        phone: secondPhone,
        district: 'Dhaka',
        thana: 'Mirpur',
      });

    assert.equal(dupRes.status, 409);
    assert.equal(dupRes.body.success, false);
    assert.ok(dupRes.body.error.includes('already exists'));

    // 4. Seamless guest donor claim: When a user creates an account with this phone, they link seamlessly
    const userRegRes = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Public Voluntary Donor Account',
        email: `claimed_${timestamp}@example.com`,
        password: 'Password123!',
        phone: secondPhone,
      });

    assert.equal(userRegRes.status, 201);
    secondUserToken = userRegRes.body.data.token;
    secondUserId = userRegRes.body.data.user.id;

    // Update profile with donor info links the pre-existing record
    const claimRes = await request(app)
      .patch('/api/auth/profile')
      .set('Authorization', `Bearer ${secondUserToken}`)
      .send({
        donor: {
          bloodGroup: 'AB+',
        },
      });
    assert.equal(claimRes.status, 200);
    assert.ok(claimRes.body.data.donorProfile);
    assert.equal(claimRes.body.data.donorProfile.district, 'Rajshahi');
  });

  // =========================================================================
  // PHASE 7: Organization Sign-In 2FA Workflow
  // =========================================================================
  test('E2E Organization Sign-In: Step 1 challenge generation, dev retrieval, and Step 2 completion', async () => {
    // 0. Ensure admin user exists with known password
    await prisma.user.upsert({
      where: { email: 'admin@blooddonor.org' },
      update: {
        role: 'SUPER_ADMIN',
        isActive: true,
        password: await bcrypt.hash('AdminPassword123!', 10),
      },
      create: {
        name: 'Shoufiq Rahman Shifat',
        email: 'admin@blooddonor.org',
        password: await bcrypt.hash('AdminPassword123!', 10),
        role: 'SUPER_ADMIN',
        isActive: true,
      },
    });

    // 1. Step 1: Initiate Organization Login
    const initRes = await request(app)
      .post('/api/auth/organization/initiate')
      .send({
        email: 'admin@blooddonor.org',
        password: 'AdminPassword123!',
      });

    assert.equal(initRes.status, 200);
    assert.equal(initRes.body.success, true);
    assert.ok(initRes.body.data.challengeId);
    assert.ok(initRes.body.data.maskedEmail);
    const challengeId = initRes.body.data.challengeId;

    // 2. Retrieve single-use verification code in test mode
    const devCodeRes = await request(app).get(`/api/auth/dev-code/${challengeId}`);
    assert.equal(devCodeRes.status, 200);
    assert.ok(devCodeRes.body.code);
    const code = devCodeRes.body.code;

    // 3. Step 2: Invalid code attempt rejected
    const invalidVerifyRes = await request(app)
      .post('/api/auth/organization/verify')
      .send({
        challengeId,
        code: '000000',
      });
    assert.equal(invalidVerifyRes.status, 400);

    // 4. Step 2: Valid code produces administrative JWT token
    const verifyRes = await request(app)
      .post('/api/auth/organization/verify')
      .send({
        challengeId,
        code,
      });

    assert.equal(verifyRes.status, 200);
    assert.equal(verifyRes.body.success, true);
    assert.ok(verifyRes.body.data.token);
    assert.equal(verifyRes.body.data.user.role, 'SUPER_ADMIN');

    // 5. Single-use enforcement: Attempting to use the same code again fails
    const reuseRes = await request(app)
      .post('/api/auth/organization/verify')
      .send({
        challengeId,
        code,
      });
    assert.equal(reuseRes.status, 400);
    assert.ok(reuseRes.body.error.includes('already been used'));
  });

  // =========================================================================
  // Clean up test users created during audit
  // =========================================================================
  test('Post-audit test record cleanup', async () => {
    if (userId) {
      await prisma.donor.deleteMany({ where: { userId } });
      await prisma.user.deleteMany({ where: { id: userId } });
    }
    if (secondUserId) {
      await prisma.donor.deleteMany({ where: { userId: secondUserId } });
      await prisma.user.deleteMany({ where: { id: secondUserId } });
    }
    await prisma.donor.deleteMany({ where: { phone: testPhone } });
    await prisma.donor.deleteMany({ where: { phone: secondPhone } });
  });
});
