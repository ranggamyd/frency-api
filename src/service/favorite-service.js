import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { logger } from "../application/logging.js";

const getFavoritedFranchises = async (franchisee_id) => {
  const favoritedFranchises = await prismaClient.franchise.findMany({
    where: { favorite: { some: { franchisee_id } } },
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

  if (favoritedFranchises.length < 1) throw new ResponseError(404, "You haven't favorited any franchises !");

  return favoritedFranchises;
};

const favorite = async (franchise_id, franchisee_id) => {
  const favoritedFranchise = await prismaClient.favorite.findFirst({ where: { franchise_id, franchisee_id } })
  if (favoritedFranchise) throw new ResponseError(401, "Franchise has been added to your favorite !");

  await prismaClient.favorite.create({ data: { franchise_id, franchisee_id } });
  
  return await prismaClient.franchise.findMany({
    where: { favorite: { some: { franchisee_id } } },
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

const unfavorite = async (franchise_id, franchisee_id) => {
  const favoritedFranchise = await prismaClient.favorite.findFirst({ where: { franchise_id, franchisee_id } })
  if (!favoritedFranchise) throw new ResponseError(401, "Franchise hasn't been added to your favorite !");

  return await prismaClient.favorite.deleteMany({ where: { franchise_id, franchisee_id } });
};

export default { getFavoritedFranchises, favorite, unfavorite };
