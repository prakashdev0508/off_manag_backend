import { DepartmentSlug, PrismaClient  } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

    console.log("Seeding departments");

    //Clear all data

    const allDeparrments = Object.values(DepartmentSlug)

    console.log("All departments", allDeparrments);

    for (const department of allDeparrments) {
        await prisma.department.create({
            data: {
                name: department,
                slug: department
            }
        })
    }

    console.log("Departments seeded");



}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    console.log("Seeding completed");
    await prisma.$disconnect();
  });

