import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { createFranchiseValidation, updateFranchiseValidation, searchFranchiseValidation } from "../validation/franchise-validation.js";
import { ResponseError } from "../error/response-error.js";
import { Storage } from "@google-cloud/storage";
import { logger } from "../application/logging.js";

const getAll = async (user) => {
  const franchise = await prismaClient.franchise.findMany({
    where: { franchisor_id: user.id },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: true,
      gallery: true,
    },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return franchise;
};

const update = async (user, request) => {
  if (user.role.toLowerCase() != "franchisor") throw new ResponseError(401, "Access Forbidden !");

  const { franchiseType, ...franchiseData } = validate(updateFranchiseValidation, request);

  const franchise = await prismaClient.franchise.findFirst({ where: { id: franchiseData.id, franchisor_id: user.id } });
  if (!franchise) throw new Error("Franchise not found !");

  const updatedFranchise = await prismaClient.franchise.update({
    where: { id: franchiseData.id },
    data: franchiseData,
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: true,
      gallery: true,
    },
  });

  if (franchiseType && (franchiseType.length > 0)) {
    await prismaClient.franchiseType.deleteMany({ where: { franchise_id: franchiseData.id } });

    await Promise.all(
      franchiseType.map(async (item) => {
        return await prismaClient.franchiseType.create({ data: { franchise_id: updatedFranchise.id, franchise_type: item.franchise_type, facility: item.facility, price: item.price } });
      })
    );
  }

  return updatedFranchise;
};

const remove = async (user, id) => {
  if (user.role.toLowerCase() != "franchisor") throw new ResponseError(401, "Access Forbidden !");

  id = validate(getFranchiseValidation, id);

  const franchise = await prismaClient.franchise.findFirst({ where: { id, franchisor_id: user.id } });
  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return await prismaClient.franchise.delete({ where: { id } });
};

const search = async (request) => {
  request = validate(searchFranchiseValidation, request);

  logger.info(request);

  return await prismaClient.franchise.findMany({
    where: { 
      AND: [
        { franchise_name: { contains: request.franchise_name, mode: "insensitive" } },
        { address: { contains: request.address, mode: "insensitive" } },
        { category: { contains: request.category, mode: "insensitive" } },
        { franchiseType: { some: { franchise_type: { contains: request.franchise_type, mode: "insensitive" } } } },
        { franchiseType: { some: { facility: { contains: request.facility, mode: "insensitive" } } } },
        { franchiseType: { some: { price: { contains: request.price, mode: "insensitive" } } } },
      ],
    },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: true,
      gallery: true,
    },
  });
};

export default { getAll };

