// Seed script using Prisma Client
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Seed data for User model
  const users = [
    {
      name: "John Doe",
      email: "john@example.com",
      password: await bcrypt.hash("123", 10),
      role: "user",
    },
    {
      name: "Jane Smith",
      email: "jane@example.com",
      password: await bcrypt.hash("123", 10),
      role: "admin",
    },
    // Add more users here as needed
  ];

  // Seed data for Franchise model
  const franchises = [
    {
      franchise_name: "Franchise A",
      address: "123 Main St",
      description: "A great franchise!",
      category: "Food",
      whatsapp_number: "123456789",
      franchisor_id: 1, // Assign the franchisor_id corresponding to the user created above
    },
    {
      franchise_name: "Franchise B",
      address: "456 Elm St",
      description: "Another amazing franchise!",
      category: "Retail",
      whatsapp_number: "987654321",
      franchisor_id: 2, // Assign the franchisor_id corresponding to the user created above
    },
    // Add more franchises here as needed
  ];

  // Seed data for Type model
  const types = [
    {
      franchise_type: "Type A",
    },
    {
      franchise_type: "Type B",
    },
    {
      franchise_type: "Type C",
    },
    // Add more types here as needed
  ];

  // Seed data for FranchiseType model
  const franchiseTypes = [
    {
      franchise_id: 1, // Assign the franchise_id corresponding to the franchise created above
      type_id: 1, // Assign the type_id corresponding to the type created above
    },
    {
      franchise_id: 2, // Assign the franchise_id corresponding to the franchise created above
      type_id: 2, // Assign the type_id corresponding to the type created above
    },
    // Add more FranchiseType associations here as needed
  ];

  // Seed data for Gallery model
  const galleries = [
    {
      franchise_id: 1, // Assign the franchise_id corresponding to the franchise created above
      image: "https://example.com/image1.jpg",
    },
    {
      franchise_id: 2, // Assign the franchise_id corresponding to the franchise created above
      image: "https://example.com/image2.jpg",
    },
    // Add more gallery images here as needed
  ];

  // Create users
  await prisma.user.createMany({ data: users });

  // Create franchises
  await prisma.franchise.createMany({ data: franchises });

  // Create types
  await prisma.type.createMany({ data: types });

  // Create FranchiseType associations
  await prisma.franchiseType.createMany({ data: franchiseTypes });

  // Create gallery images
  await prisma.gallery.createMany({ data: galleries });

  console.log("Seed data inserted successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
