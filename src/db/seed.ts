import bcrypt from "bcrypt";
import { PrismaClient, UserRole } from ".prisma/client";
import { HASH_ROUNDS } from "../util/constants";

const prisma = new PrismaClient();

async function main() {
  // User Data
  const users = [
    {
      email: "unverified@gmail.com",
      password: await bcrypt.hash("12345", HASH_ROUNDS),
      name: "Unverified User",
      role: UserRole.UNVERIFIED,
      timeGoal: "2 hours",
      wordGoal: "500 words",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "user@gmail.com",
      password: await bcrypt.hash("12345", HASH_ROUNDS),
      name: "Normal User",
      role: UserRole.USER,
      timeGoal: "3 hours",
      wordGoal: "1000 words",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      email: "admin@gmail.com",
      password: await bcrypt.hash("12345", HASH_ROUNDS),
      name: "Administrator",
      role: UserRole.ADMIN,
      timeGoal: "5 hours",
      wordGoal: "5000 words",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  // Create Users
  await Promise.all(
    users.map(async (user) => {
      try {
        await prisma.user.upsert({
          where: { email: user.email },
          update: {
            ...user,
          },
          create: {
            ...user,
          },
        });
      } catch (e) {
        console.log("Error creating user:", e);
      }
    }),
  );

  // Day Data
  const days = [
    {
      title: "Day 1",
      value: 10,
      year: 2025,
      month: 1, // January
      date: 1,
      totalTime: 120, // Total minutes
      totalWords: 1000,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      title: "Day 2",
      value: 20,
      year: 2025,
      month: 1, // January
      date: 2,
      totalTime: 180,
      totalWords: 1500,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  console.log("Seeding done");
  process.exit(0);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
