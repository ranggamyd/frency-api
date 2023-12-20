import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";

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
  await prismaClient.favorite.delete({ where: { franchise_id, franchisee_id } });
  
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

export default { getFavoritedFranchises, favorite, unfavorite };
