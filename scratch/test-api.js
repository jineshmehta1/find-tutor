const { PrismaClient } = require("../lib/generated/prisma");
const prisma = new PrismaClient();

async function main() {
  try {
    const teachers = await prisma.teacher.findMany({
      include: { user: true }
    });
    
    console.log("====================================");
    console.log("PARSING DIAGNOSTICS:");
    teachers.forEach((t, i) => {
      console.log(`Teacher #${i + 1}: ${t.user?.name}`);
      
      // Certifications
      try {
        const parsed = JSON.parse(t.certifications || "[]");
        console.log("  [OK] Certifications parsed: ", parsed);
      } catch (e) {
        console.log("  [FAIL] Certifications raw: ", t.certifications);
      }

      // Subjects
      try {
        const parsed = JSON.parse(t.subjects || "[]");
        console.log("  [OK] Subjects parsed: ", parsed);
      } catch (e) {
        console.log("  [FAIL] Subjects raw: ", t.subjects);
      }

      // Classes
      try {
        const parsed = t.classesOrAgeGroup ? JSON.parse(t.classesOrAgeGroup) : null;
        console.log("  [OK] Classes parsed: ", parsed);
      } catch (e) {
        console.log("  [FAIL] Classes raw: ", t.classesOrAgeGroup);
      }
    });
    console.log("====================================");
  } catch (err) {
    console.error("Failed:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
