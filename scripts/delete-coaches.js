const { PrismaClient } = require("../lib/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking current coaches in database...");
  const currentCoaches = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { email: true, name: true }
  });
  console.log("Current coaches:", currentCoaches);

  console.log("Deleting coaches (except coach@aacharya.net)...");
  const result = await prisma.user.deleteMany({
    where: {
      role: "TEACHER",
      email: {
        not: "coach@aacharya.net"
      }
    }
  });

  console.log(`Successfully deleted ${result.count} coaches.`);

  const remainingCoaches = await prisma.user.findMany({
    where: { role: "TEACHER" },
    select: { email: true, name: true }
  });
  console.log("Remaining coaches in database:", remainingCoaches);
}

main()
  .catch((err) => {
    console.error("Error executing cleanup script:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
