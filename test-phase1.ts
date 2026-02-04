import "dotenv/config";
import { willSchema } from "./src/lib/validations/will";
import { db } from "./src/server/db";

if (!process.env.DATABASE_URL) {
  console.error("❌ Error: DATABASE_URL is not defined in environment variables.");
  process.exit(1);
}

async function testPhase1() {
  console.log("🔍 Starting Phase 1 Verification...\n");

  // TEST 1: Database Connection
  try {
    console.log("1️⃣ Testing Database Connection...");
    const userCount = await db.user.count();
    console.log(`✅ Database Connected! Users found: ${userCount}\n`);
  } catch (error) {
    console.error("❌ Database Connection Failed:", error);
    process.exit(1);
  }

  // TEST 2: Zod Validation - Success Case
  console.log("2️⃣ Testing Zod Validation (Valid Data)...");
  const validData = {
    fullName: "John Doe",
    dob: new Date("1990-01-01"), // > 18 years
    residency: "India",
    assets: [
      { type: "BANK_ACCOUNT", description: "HDFC Savings", estimatedValue: 50000 }
    ],
    beneficiaries: [
      { fullName: "Jane Doe", relationship: "Spouse", percentage: 50 },
      { fullName: "Baby Doe", relationship: "Child", percentage: 50 }
    ]
  };
  const resultSuccess = willSchema.safeParse(validData);
  if (resultSuccess.success) {
    console.log("✅ Valid Data passed validation!\n");
  } else {
    console.error("❌ Valid Data FAILED:", resultSuccess.error.format());
  }

  // TEST 3: Zod Validation - Failure Case (Age)
  console.log("3️⃣ Testing Zod Validation (Underage Check)...");
  const underageData = { ...validData, dob: new Date() }; // Today
  const resultAge = willSchema.safeParse(underageData);
  if (!resultAge.success) {
    console.log("✅ Underage check passed (Validation Failed as expected)");
    console.log("   Error:", resultAge.error.flatten().fieldErrors.dob?.[0], "\n");
  } else {
    console.error("❌ Underage Data PASSED validation (Should Fail!)\n");
  }

  // TEST 4: Zod Validation - Failure Case (Beneficiaries != 100%)
  console.log("4️⃣ Testing Zod Validation (Allocation Check)...");
  const badAllocationData = { 
    ...validData, 
    beneficiaries: [{ fullName: "Jane", relationship: "Spouse", percentage: 90 }] 
  };
  const resultAlloc = willSchema.safeParse(badAllocationData);
  if (!resultAlloc.success) {
    console.log("✅ Allocation check passed (Validation Failed as expected)");
    console.log("   Error:", resultAlloc.error.flatten().fieldErrors.beneficiaries?.[0], "\n");
  } else {
    console.error("❌ Bad Allocation Data PASSED validation (Should Fail!)\n");
  }

  console.log("🎉 Phase 1 Verification Completed Successfully!");
}

testPhase1()
  .catch(console.error)
  .finally(() => db.$disconnect());
