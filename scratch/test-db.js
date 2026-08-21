const { PrismaClient } = require("../lib/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    const usersCount = await prisma.user.count();
    const teachersCount = await prisma.teacher.count();
    const teachers = await prisma.teacher.findMany({
      include: { user: true }
    });
    
    console.log("====================================");
    console.log("DIAGNOSTIC REPORT:");
    console.log("USERS COUNT IN DB:", usersCount);
    console.log("TEACHERS COUNT IN DB:", teachersCount);
    console.log("------------------------------------");
    teachers.forEach((t, i) => {
      console.log(`Teacher #${i + 1}:`);
      console.log(`  Name: ${t.user?.name}`);
      console.log(`  Role: ${t.user?.role}`);
      console.log(`  isApproved: ${t.isApproved}`);
      console.log(`  Subjects: ${t.subjects}`);
    });
    console.log("====================================");
  } catch (err) {
    console.error("Database connection or query failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
