# Manual Testing & Verification

Use these commands to verify your setup.

### 1. Test Database Connection (Prisma)

This command attempts to connect to the DB and read the schema. If this fails, your DB is not running or credentials are wrong.

```bash
npx prisma db pull
```

### 2. Run Phase 1 Validations

Runs the `test-phase1.ts` script to check Zod schemas and DB connection.

```bash
npx tsx test-phase1.ts
```

### 3. Check Local Database (PSQL)

If you have `psql` installed, try connecting directly:

```bash
psql "postgresql://postgres:Abhinav%4019@localhost:5432/banyyan_wills"
```

_Note: The password `Abhinav@19` is URL-encoded as `Abhinav%4019`._

### Troubleshooting

- Ensure Postgres is running on port `5432`.
- Ensure the database `banyyan_wills` exists.
