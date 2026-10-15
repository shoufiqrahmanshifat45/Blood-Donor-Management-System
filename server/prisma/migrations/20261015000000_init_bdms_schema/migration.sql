-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'STAFF', 'VOLUNTEER', 'DONOR', 'HOSPITAL_COORDINATOR');

-- CreateEnum
CREATE TYPE "BloodGroup" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female', 'Other');

-- CreateEnum
CREATE TYPE "DonorStatus" AS ENUM ('Eligible', 'Ineligible', 'Pending');

-- CreateEnum
CREATE TYPE "RequestUrgency" AS ENUM ('Urgent', 'Pending', 'Fulfilled', 'Cancelled');

-- CreateEnum
CREATE TYPE "AppointmentStatus" AS ENUM ('Scheduled', 'Completed', 'Cancelled', 'NoShow');

-- CreateEnum
CREATE TYPE "StockStatus" AS ENUM ('Good', 'Low', 'Critical');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('INFO', 'URGENT_REQUEST', 'DONATION_REMINDER', 'APPOINTMENT', 'STOCK_ALERT');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'ADMIN',
    "phone" TEXT,
    "avatarUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_users" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'Admin',
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donors" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "gender" "Gender" NOT NULL,
    "age" INTEGER NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT,
    "district" TEXT NOT NULL,
    "thana" TEXT NOT NULL,
    "address" TEXT,
    "lastDonationDate" TIMESTAMP(3),
    "totalDonations" INTEGER NOT NULL DEFAULT 0,
    "status" "DonorStatus" NOT NULL DEFAULT 'Eligible',
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "readyForEmergency" BOOLEAN NOT NULL DEFAULT true,
    "weightKg" DOUBLE PRECISION,
    "nextEligibleDate" TIMESTAMP(3),
    "ineligibilityReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "donors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_donations" (
    "id" TEXT NOT NULL,
    "donorId" TEXT NOT NULL,
    "bloodRequestId" TEXT,
    "bloodGroup" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 1,
    "donationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "location" TEXT NOT NULL,
    "verifiedById" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blood_donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_stocks" (
    "id" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "availableUnits" INTEGER NOT NULL DEFAULT 0,
    "reservedUnits" INTEGER NOT NULL DEFAULT 0,
    "status" "StockStatus" NOT NULL DEFAULT 'Good',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_stocks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_requests" (
    "id" TEXT NOT NULL,
    "patientName" TEXT NOT NULL,
    "hospital" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "units" INTEGER NOT NULL DEFAULT 1,
    "urgency" "RequestUrgency" NOT NULL DEFAULT 'Urgent',
    "contactPhone" TEXT NOT NULL,
    "contactName" TEXT,
    "notes" TEXT,
    "requiredDate" TIMESTAMP(3),
    "fulfilledUnits" INTEGER NOT NULL DEFAULT 0,
    "requesterId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blood_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "appointments" (
    "id" TEXT NOT NULL,
    "donorId" TEXT,
    "donorName" TEXT NOT NULL,
    "donorPhone" TEXT NOT NULL,
    "bloodGroup" "BloodGroup" NOT NULL,
    "appointmentDate" TIMESTAMP(3) NOT NULL,
    "appointmentTime" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "status" "AppointmentStatus" NOT NULL DEFAULT 'Scheduled',
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "appointments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "relatedEntityId" TEXT,
    "relatedEntityType" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_metrics" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "change" TEXT NOT NULL,
    "trend" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_metrics_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE UNIQUE INDEX "admin_users_email_key" ON "admin_users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "donors_userId_key" ON "donors"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "donors_phone_key" ON "donors"("phone");

-- CreateIndex
CREATE INDEX "donors_bloodGroup_idx" ON "donors"("bloodGroup");

-- CreateIndex
CREATE INDEX "donors_district_thana_idx" ON "donors"("district", "thana");

-- CreateIndex
CREATE INDEX "donors_status_isAvailable_idx" ON "donors"("status", "isAvailable");

-- CreateIndex
CREATE INDEX "donors_phone_idx" ON "donors"("phone");

-- CreateIndex
CREATE INDEX "blood_donations_donorId_idx" ON "blood_donations"("donorId");

-- CreateIndex
CREATE INDEX "blood_donations_bloodRequestId_idx" ON "blood_donations"("bloodRequestId");

-- CreateIndex
CREATE INDEX "blood_donations_bloodGroup_idx" ON "blood_donations"("bloodGroup");

-- CreateIndex
CREATE INDEX "blood_donations_donationDate_idx" ON "blood_donations"("donationDate");

-- CreateIndex
CREATE UNIQUE INDEX "blood_stocks_bloodGroup_key" ON "blood_stocks"("bloodGroup");

-- CreateIndex
CREATE INDEX "blood_requests_urgency_idx" ON "blood_requests"("urgency");

-- CreateIndex
CREATE INDEX "blood_requests_bloodGroup_idx" ON "blood_requests"("bloodGroup");

-- CreateIndex
CREATE INDEX "blood_requests_hospital_idx" ON "blood_requests"("hospital");

-- CreateIndex
CREATE INDEX "blood_requests_createdAt_idx" ON "blood_requests"("createdAt");

-- CreateIndex
CREATE INDEX "appointments_donorId_idx" ON "appointments"("donorId");

-- CreateIndex
CREATE INDEX "appointments_appointmentDate_idx" ON "appointments"("appointmentDate");

-- CreateIndex
CREATE INDEX "appointments_status_idx" ON "appointments"("status");

-- CreateIndex
CREATE INDEX "notifications_userId_idx" ON "notifications"("userId");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "system_metrics_key_key" ON "system_metrics"("key");

-- AddForeignKey
ALTER TABLE "donors" ADD CONSTRAINT "donors_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_bloodRequestId_fkey" FOREIGN KEY ("bloodRequestId") REFERENCES "blood_requests"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_donations" ADD CONSTRAINT "blood_donations_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blood_requests" ADD CONSTRAINT "blood_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "appointments" ADD CONSTRAINT "appointments_donorId_fkey" FOREIGN KEY ("donorId") REFERENCES "donors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
