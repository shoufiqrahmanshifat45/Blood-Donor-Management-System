# PostgreSQL & Prisma Database Documentation
Blood Donor Management System (BDMS)

---

## 1. Environment Inspection Summary

An automated audit of the Windows host environment was conducted with the following findings:
- **`psql` CLI:** Not found in system PATH.
- **PostgreSQL Windows Service:** No running service (`*postgres*`) detected.
- **Port 5432:** Checked via TCP probe (`Test-NetConnection -ComputerName localhost -Port 5432`); port is closed (`TcpTestSucceeded: False`).
- **Container Runtime:** Docker is not installed or not in PATH.
- **Credentials:** No active `.env` file exists in the repository.

**Conclusion:** Local PostgreSQL is **unavailable** in the current environment.

---

## 2. Recommended Managed PostgreSQL Provider

Since local PostgreSQL is absent, we recommend using a cloud-managed PostgreSQL provider.

### Primary Recommendation: **Neon Serverless PostgreSQL**
- **Website:** [https://neon.tech](https://neon.tech)
- **Free Tier:** 0.5 GiB persistent storage, completely free without credit card.
- **Compatibility:** 100% native PostgreSQL 16 compatible with full Prisma support.
- **Connection Pooling:** Built-in connection pooling (`pgbouncer=true` parameter or pooled connection string), which prevents connection pool exhaustion in serverless or development environments.
- **Setup Time:** Under 60 seconds (one-click project creation).
- **Prisma Connection URL Format:**
  ```env
  DATABASE_URL="postgresql://[USER]:[PASSWORD]@[ENDPOINT].us-east-2.aws.neon.tech/[DBNAME]?sslmode=require&pgbouncer=true"
  ```

### Alternative Managed Provider: **Supabase**
- **Website:** [https://supabase.com](https://supabase.com)
- **Free Tier:** 500 MB database, pooled connection on port `6543`.
- **Prisma Connection URL Format:**
  ```env
  DATABASE_URL="postgresql://postgres.[PROJECT_REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres?sslmode=require"
  ```

---

## 3. Alternative: Local PostgreSQL Installation Steps

If you prefer running PostgreSQL locally on Windows:

### Method A: Windows Package Manager (`winget`)
Run PowerShell as Administrator:
```powershell
winget install PostgreSQL.PostgreSQL.16
```
Follow the installer prompts, set the superuser `postgres` password, and keep default port `5432`.

### Method B: Official EnterpriseDB Windows Installer
1. Download PostgreSQL 16 for Windows from [postgresql.org/download/windows](https://www.postgresql.org/download/windows/).
2. Run the installer, select PostgreSQL Server and Command Line Tools.
3. Set the port to `5432` and enter a password for the `postgres` user.
4. Verify the service is running in Windows Services (`services.msc`) or run:
   ```cmd
   net start postgresql-x64-16
   ```

### Method C: Docker (if Docker Desktop is installed)
```bash
docker run --name bdms-postgres -e POSTGRES_PASSWORD=your_password -e POSTGRES_DB=blood_donor_db -p 5432:5432 -d postgres:16-alpine
```

---

## 4. Prisma Schema Design & Relational Model

The schema is defined in [`server/prisma/schema.prisma`](file:///server/prisma/schema.prisma) and includes:

### Models & Enums

| Model | Table | Description | Key Relationships & Indexes |
|---|---|---|---|
| `User` | `users` | User accounts, authentication & roles (`SUPER_ADMIN`, `ADMIN`, `STAFF`, `VOLUNTEER`, `DONOR`, `HOSPITAL_COORDINATOR`) | Index on `role`, unique index on `email`. 1:1 with `Donor`, 1:N with `BloodRequest`, 1:N with `Notification`. |
| `AdminUser` | `admin_users` | Backward compatibility model for Admin dashboard users | Unique index on `email`. |
| `Donor` | `donors` | Donor profile with responsible eligibility & availability modeling | Foreign key to `users.id` (optional). Indexes on `bloodGroup`, `(district, thana)`, `(status, isAvailable)`, `phone`. |
| `BloodDonation` | `blood_donations` | Historical donation records linking donors and fulfilled blood requests | Foreign keys to `donors.id` (`ON DELETE CASCADE`), `blood_requests.id` (`ON DELETE SET NULL`), and `users.id` (verifiedBy). |
| `BloodRequest` | `blood_requests` | Patient/hospital blood demands with urgency tracking (`Urgent`, `Pending`, `Fulfilled`, `Cancelled`) | Foreign key to `users.id` (`requesterId`). Indexes on `urgency`, `bloodGroup`, `hospital`, `createdAt`. |
| `Appointment` | `appointments` | Clinic and donation drive appointment scheduling | Foreign key to `donors.id` (`ON DELETE SET NULL`). Indexes on `donorId`, `appointmentDate`, `status`. |
| `Notification` | `notifications` | System alerts, emergency requests, stock alerts, reminders | Foreign key to `users.id` (`ON DELETE CASCADE`). Indexes on `userId`, `isRead`, `createdAt`. |
| `BloodStock` | `blood_stocks` | Inventory levels for all 8 blood groups | Unique index on `bloodGroup`. |
| `SystemMetric` | `system_metrics` | Dashboard KPI performance metrics | Unique index on `key`. |

### Responsible Availability & Eligibility Modeling
The `Donor` model includes:
- `isAvailable` (Boolean): Current voluntary availability toggle.
- `readyForEmergency` (Boolean): Rapid response readiness for critical hospital transfusions.
- `weightKg` (Float): Clinical weight factor (minimum 50 kg threshold).
- `lastDonationDate` (DateTime): Timestamp of most recent donation.
- `nextEligibleDate` (DateTime): Clinical cooldown date (typically 90-120 days post-donation).
- `ineligibilityReason` (String): Documented clinical or medical deferral reason.

---

## 5. Migration & Seed Workflow

### Safe Migration Workflow
The initial migration is generated at [`server/prisma/migrations/20261015000000_init_bdms_schema/migration.sql`](file:///server/prisma/migrations/20261015000000_init_bdms_schema/migration.sql).

> [!IMPORTANT]
> Never run `prisma migrate reset` or `db push --force-reset` on an active database without permission.

#### Step 1: Configure `.env`
Create `server/.env` (and/or root `.env`):
```env
DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:5432/blood_donor_db?schema=public"
```

#### Step 2: Apply Migrations
```bash
# From workspace root:
npm run prisma:migrate

# Or directly in server directory:
cd server && npx prisma migrate deploy
```

#### Step 3: Run Development Seed Script
```bash
# From workspace root:
npm run prisma:seed

# Or in server directory:
cd server && npx tsx prisma/seed.ts
```
The seeder seeds:
- 4 system users across different roles (`SUPER_ADMIN`, `STAFF`, `HOSPITAL_COORDINATOR`, `VOLUNTEER`).
- 8 blood stock categories.
- 6 realistic donors with varied eligibility/deferral reasons.
- 5 blood requests covering `Urgent`, `Pending`, and `Fulfilled`.
- 3 verified donation records.
- 3 appointment records.
- 4 notifications.
- 4 system KPI metrics.

---

## 6. Backup and Restore Procedures

### Database Backup (`pg_dump`)

#### Plain SQL Text Backup:
```bash
pg_dump "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" > bdms_backup_$(date +%Y%m%d).sql
```

#### Custom Compressed Format (Recommended for large databases):
```bash
pg_dump -Fc "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" -f bdms_backup.dump
```

#### Backup Schema Only:
```bash
pg_dump --schema-only "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" > bdms_schema_only.sql
```

#### Backup Data Only:
```bash
pg_dump --data-only "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" > bdms_data_only.sql
```

---

### Database Restore (`psql` and `pg_restore`)

#### Restore Plain SQL Backup:
```bash
psql "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" < bdms_backup.sql
```

#### Restore Compressed Format (`pg_restore`):
```bash
pg_restore -v --clean --no-owner "postgresql://USER:PASSWORD@HOST:PORT/DATABASE?sslmode=require" bdms_backup.dump
```
> [!CAUTION]
> The `--clean` flag drops existing database objects before recreating them. Use with caution.
