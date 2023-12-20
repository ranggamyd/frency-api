import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const users = [
    {
      name: "Franchisor",
      email: "franchisor@frency.io",
      password: await bcrypt.hash("franchisor", 10),
      role: "franchisor",
    },
    {
      name: "Franchisor 2",
      email: "franchisor2@frency.io",
      password: await bcrypt.hash("franchisor", 10),
      role: "franchisor",
    },
    {
      name: "Franchisee",
      email: "franchisee@frency.io",
      password: await bcrypt.hash("franchisee", 10),
      role: "franchisee",
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
      franchisor_id: 1,
    },
    {
      franchise_name: "Franchise C",
      address: "456 Elm St",
      description: "Another amazing franchise!",
      category: "Retail",
      whatsapp_number: "987654321",
      franchisor_id: 2,
    },
  ];

  const types = [
    { franchise_type: "Stand" },
    { franchise_type: "Store" },
    { franchise_type: "Kios" },
    { franchise_type: "Outlet" },
    { franchise_type: "Mini Market" },
  ];

  const franchiseTypes = [
    { franchise_id: 1, type_id: 1, facility: "any string", price: "123" },
    { franchise_id: 1, type_id: 2, facility: "any string", price: "123" },
    { franchise_id: 2, type_id: 2, facility: "any string", price: "123" },
    { franchise_id: 2, type_id: 3, facility: "any string", price: "123" },
    { franchise_id: 3, type_id: 3, facility: "any string", price: "123" },
    { franchise_id: 3, type_id: 4, facility: "any string", price: "123" },
  ];

  const favorites = [
    { franchise_id: 1, franchisee_id: 3 },
    { franchise_id: 2, franchisee_id: 3 },
  ];

  await prisma.user.createMany({ data: users });
  await prisma.franchise.createMany({ data: franchises });
  await prisma.type.createMany({ data: types });
  await prisma.franchiseType.createMany({ data: franchiseTypes });
  await prisma.favorite.createMany({ data: favorites });
}

main()
  .catch((e) => {
    console.error(e);

    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
