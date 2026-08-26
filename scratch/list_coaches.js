const { PrismaClient } = require("../lib/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  console.log("Checking if coach@aacharya.net exists...");
  const user = await prisma.user.findUnique({
    where: { email: "coach@aacharya.net" }
  });
  console.log("User:", JSON.stringify(user, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
