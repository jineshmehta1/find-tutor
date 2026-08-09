import { prisma } from '../lib/prisma';

async function main() {
  const teachers = await prisma.teacher.findMany();
  if (teachers.length === 0) {
    console.log("No teachers found");
    return;
  }
  const teacherId = teachers[0].id;
  console.log("Using teacher ID:", teacherId);

  const updated = await prisma.lead.updateMany({
    where: {
      status: { in: ["CONVERTED", "CONTACTED"] },
      teacherId: null
    },
    data: {
      teacherId: teacherId
    }
  });
  console.log(`Updated ${updated.count} leads to belong to teacher ${teacherId}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
