"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    console.log("Seeding departments");
    //Clear all data
    const allDeparrments = Object.values(client_1.DepartmentSlug);
    console.log("All departments", allDeparrments);
    for (const department of allDeparrments) {
        await prisma.department.create({
            data: {
                name: department,
                slug: department
            }
        });
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
