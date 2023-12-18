import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Franchisor",
      email: "franchisor@frency.io",
      password: await bcrypt.hash("franchisor", 10),
      role: "Franchisor",
    },
    {
      name: "Franchisee",
      email: "franchisee@frency.io",
      password: await bcrypt.hash("franchisee", 10),
      role: "Franchisee",
    },
  ];

  const franchises = [
    {
      franchise_name: "Franchise A",
      address: "123 Main St",
      description: "A great franchise!",
      category: "Food",
      whatsapp_number: "123456789",
      franchisor_id: 1,
    },
    {
      franchise_name: "Franchise B",
      address: "456 Elm St",
      description: "Another amazing franchise!",
      category: "Retail",
      whatsapp_number: "987654321",
      franchisor_id: 2,
    },
  ];

  const types = [
    { franchise_type: "Type A" },
    { franchise_type: "Type B" },
    { franchise_type: "Type C" },
  ];

  const franchiseTypes = [
    { franchise_id: 1, type_id: 1 },
    { franchise_id: 1, type_id: 2 },
    { franchise_id: 2, type_id: 2 },
    { franchise_id: 2, type_id: 3 },
  ];

  await prisma.user.createMany({ data: users });
  await prisma.franchise.createMany({ data: franchises });
  await prisma.type.createMany({ data: types });
  await prisma.franchiseType.createMany({ data: franchiseTypes });
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
