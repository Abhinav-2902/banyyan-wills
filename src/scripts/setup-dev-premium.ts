import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Setting up development environment for Premium Will features...");

 
  try {
    // 1. Find the first user
    const user = await prisma.user.findFirst();

    if (!user) {
      console.error("❌ No users found in the database. Please sign up first.");
      return;
    }

    console.log(`👤 Found user: ${user.email} (${user.id})`);

    // 2. Upgrade user to PREMIUM
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { subscriptionTier: "PREMIUM" },
    });

    console.log(`✅ User upgraded to PREMIUM tier.`);

    // 3. Find user's latest will
    const will = await prisma.will.findFirst({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
    });

    if (!will) {
      console.log("ℹ️ No will found for this user. Creating a blank draft...");
      const newWill = await prisma.will.create({
        data: {
          userId: user.id,
          status: "DRAFT",
          data: {}, // Start with empty data
          isPaid: false
        }
      });
      console.log(`✅ Created new DRAFT will: ${newWill.id}`);
      
      // Immediately complete it for testing? Or let the user do it?
      // Let's mark it COMPLETED so they can test editing a completed will.
      await prisma.will.update({
        where: { id: newWill.id },
        data: { status: "COMPLETED", isPaid: true }
      });
      console.log(`✅ Will marked as COMPLETED.`);
      return;
    }

    console.log(`📄 Found existing will: ${will.id} (Status: ${will.status})`);

    // 4. Ensure will is COMPLETED/PAID to allow versioning test
    if (will.status !== "COMPLETED" && will.status !== "PAID") {
      await prisma.will.update({
        where: { id: will.id },
        data: { status: "COMPLETED", isPaid: true },
      });
      console.log(`✅ Will status updated to COMPLETED.`);
    } else {
      console.log(`✓ Will is already in finalized state.`);
    }

    console.log("\n🎉 Setup Complete!");
    console.log("------------------------------------------------");
    console.log("1. Log in as: " + user.email);
    console.log("2. Open the Will Editor for Will ID: " + will.id);
    console.log("3. Make changes and Save.");
    console.log("4. You should see a new version created in the Will History.");
    console.log("------------------------------------------------");
  } catch (error) {
    console.error("❌ Script Error:", error);
    process.exit(1);
  }

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
