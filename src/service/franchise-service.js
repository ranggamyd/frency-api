import { validate } from "../validation/validation.js";
import {
  createFranchiseValidation,
  getFranchiseValidation,
  updateFranchiseValidation,
  searchFranchiseValidation,
} from "../validation/franchise-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { logger } from "../application/logging.js";

const uploadImages = async (franchiseId, request) => {
  const franchise = await prismaClient.franchise.findUnique({
    where: { id: parseInt(franchiseId) },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found");

  const gallery = request.files;
  let createdGallery = [];

  if (gallery && gallery.length > 0) {
    createdGallery = await Promise.all(
      gallery.map(async (image) => {
        const imagePath = image.path; // Path dari setiap file yang diunggah

        const createdAssociation = await prismaClient.gallery.create({
          data: {
            image: imagePath,
            franchise_id: parseInt(franchiseId),
          },
        });

        return createdAssociation;
      })
    );
  }

  // Fetch the created franchise with its updated associations
  const updatedFranchise = await prismaClient.franchise.findUnique({
    where: { id: parseInt(franchiseId) },
    include: {
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  return updatedFranchise;
};

const create = async (user, request) => {
  const { franchiseType, gallery, ...franchiseData } = validate(
    createFranchiseValidation,
    request
  );
  franchiseData.franchisor_id = user.id;

  let createdFranchise;
  let createdFranchiseType = [];

  createdFranchise = await prismaClient.franchise.create({
    data: franchiseData,
    include: {
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  if (franchiseType && franchiseType.length > 0) {
    createdFranchiseType = await Promise.all(
      franchiseType.map(async (typeId) => {
        const createdAssociation = await prismaClient.franchiseType.create({
          data: {
            franchise_id: createdFranchise.id,
            type_id: typeId,
          },
        });
        return createdAssociation;
      })
    );
  }

  // Fetch the created franchise with its updated associations
  const updatedFranchise = await prismaClient.franchise.findUnique({
    where: { id: createdFranchise.id },
    include: {
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  return updatedFranchise;
};

const getAll = async () => {
  const franchise = await prismaClient.franchise.findMany({
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  if (!franchise) throw new ResponseError(404, "franchise is not found");

  return franchise;
};

const getMyFranchises = async (user) => {
  const franchise = await prismaClient.franchise.findMany({
    where: {
      franchisor_id: user.id,
    },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  if (!franchise) throw new ResponseError(404, "franchise is not found");

  return franchise;
};

const get = async (franchiseId) => {
  franchiseId = validate(getFranchiseValidation, franchiseId);

  const franchise = await prismaClient.franchise.findFirst({
    where: {
      id: franchiseId,
    },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  if (!franchise) throw new ResponseError(404, "franchise is not found");

  return franchise;
};

const update = async (user, request) => {
  const { franchiseType, ...franchiseData } = validate(
    updateFranchiseValidation,
    request
  );

  const franchise = await prismaClient.franchise.findFirst({
    where: { id: franchiseData.id, franchisor_id: user.id },
  });

  if (!franchise) throw new Error("Franchise not found");

  let updatedFranchise;

  // Update franchise excluding franchiseType data
  updatedFranchise = await prismaClient.franchise.update({
    where: { id: franchiseData.id },
    data: franchiseData,
    include: {
      franchisor: true,
      franchiseType: true,
      gallery: true,
    },
  });

  // Check if franchiseType data exists
  if (franchiseType && franchiseType.length > 0) {
    // Delete existing franchiseType associations
    await prismaClient.franchiseType.deleteMany({
      where: {
        franchise_id: franchiseData.id,
      },
    });

    // Create new franchiseType associations
    const createdFranchiseType = await Promise.all(
      franchiseType.map(async (typeId) => {
        const createdAssociation = await prismaClient.franchiseType.create({
          data: {
            franchise_id: franchiseData.id,
            type_id: typeId,
          },
        });
        return createdAssociation;
      })
    );

    updatedFranchise.franchiseType = createdFranchiseType;
  }

  return updatedFranchise;
};

const remove = async (user, franchiseId) => {
  franchiseId = validate(getFranchiseValidation, franchiseId);

  const franchise = await prismaClient.franchise.count({
    where: {
      franchisor_id: user.id,
      id: franchiseId,
    },
  });

  if (!franchise) throw new ResponseError(404, "franchise is not found");

  return prismaClient.franchise.delete({
    where: {
      id: franchiseId,
    },
  });
};

const search = async (request) => {
  request = validate(searchFranchiseValidation, request);

  // 1 ((page - 1) * size) = 0
  // 2 ((page - 1) * size) = 10
  const skip = (request.page - 1) * request.size;

  const filters = [];
  if (request.franchise_name) {
    filters.push({
      franchise_name: {
        contains: request.name,
      },
    });
  }
  if (request.address) {
    filters.push({
      address: {
        contains: request.address,
      },
    });
  }
  if (request.description) {
    filters.push({
      description: {
        contains: request.description,
      },
    });
  }
  if (request.category) {
    filters.push({
      category: {
        contains: request.category,
      },
    });
  }
  if (request.whatsapp_number) {
    filters.push({
      whatsapp_number: {
        contains: request.whatsapp_number,
      },
    });
  }

  const franchises = await prismaClient.franchise.findMany({
    where: {
      AND: filters,
    },
    take: request.size,
    skip: skip,
  });

  const totalItems = await prismaClient.franchise.count({
    where: {
      AND: filters,
    },
  });

  return {
    data: franchises,
    paging: {
      page: request.page,
      total_item: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
  };
};

export default {
  uploadImages,
  create,
  getAll,
  getMyFranchises,
  get,
  update,
  remove,
  search,
};
