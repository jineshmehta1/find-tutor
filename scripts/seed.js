const { PrismaClient } = require("../lib/generated/prisma");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const passwordHash = await bcrypt.hash("aacharya123", 10);

  // 1. Seed Student User
  const studentUser = await prisma.user.upsert({
    where: { email: "student@aacharya.net" },
    update: {},
    create: {
      name: "Rohan Student",
      email: "student@aacharya.net",
      phone: "9876543210",
      password: passwordHash,
      dob: new Date("2012-05-15"),
      address: "Lalitha Nagar, Swathi Road, Bhavanipuram, Vijayawada",
      role: "STUDENT",
      student: {
        create: {
          subjects: JSON.stringify(["Mathematics", "Physics", "Coding"]),
        }
      }
    }
  });
  console.log("Student seeded:", studentUser.email);

  // 2. Seed Teacher (Tutor) User
  const teacherUser = await prisma.user.upsert({
    where: { email: "teacher@aacharya.net" },
    update: {},
    create: {
      name: "Sandeep Kumar",
      email: "teacher@aacharya.net",
      phone: "8074103400",
      password: passwordHash,
      dob: new Date("1985-08-20"),
      address: "Bhavanipuram, Vijayawada",
      role: "TEACHER",
      teacher: {
        create: {
          certifications: JSON.stringify(["IIT Physics certified", "CBSE Board Evaluator"]),
          education: "Ph.D. in Physics",
          experience: "12+ Years Experience",
          subjects: JSON.stringify(["Physics", "Mathematics", "Competitive JEE"]),
          teachingMode: "Home Tutor",
          classesOrAgeGroup: JSON.stringify(["Class 9-10", "Class 11-12"]),
          qualificationLevel: "PhD",
          qualificationName: "Doctorate",
          achievements: "Best Teacher Awardee Vijayawada",
          isApproved: true,
          subscriptionStatus: "active",
          subscriptionEnd: new Date("2027-12-31")
        }
      }
    }
  });
  console.log("Teacher seeded:", teacherUser.email);

  // 3. Seed Admin User
  const adminUser = await prisma.user.upsert({
    where: { email: "admin@aacharya.net" },
    update: {},
    create: {
      name: "Aacharya Admin",
      email: "admin@aacharya.net",
      phone: "8074103400",
      password: passwordHash,
      dob: new Date("1980-01-01"),
      address: "Sivalayam Center, Bhavanipuram, Vijayawada",
      role: "ADMIN"
    }
  });
  console.log("Admin seeded:", adminUser.email);

  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
