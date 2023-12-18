import { validate } from "../validation/validation.js";
import {
  createFranchiseValidation,
  getFranchiseValidation,
  updateFranchiseValidation,
  // searchFranchiseValidation,
} from "../validation/franchise-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import { Storage } from "@google-cloud/storage";
import { logger } from "../application/logging.js";

const getAll = async () => {
  const franchise = await prismaClient.franchise.findMany({
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return franchise;
};

const get = async (id) => {
  id = validate(getFranchiseValidation, id);

  const franchise = await prismaClient.franchise.findUnique({
    where: { id },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return franchise;
};

const create = async (user, request) => {
  const { franchiseType, ...franchiseData } = validate(
    createFranchiseValidation,
    request
  );
  franchiseData.franchisor_id = user.id;

  let createdFranchise;
  let createdFranchiseType = [];

  createdFranchise = await prismaClient.franchise.create({
    data: franchiseData,
  });

  if (franchiseType && franchiseType.length > 0) {
    createdFranchiseType = await Promise.all(
      franchiseType.map(async (type_id) => {
        const createdAssociation = await prismaClient.franchiseType.create({
          data: { franchise_id: createdFranchise.id, type_id },
        });
        return createdAssociation;
      })
    );
  }

  return await prismaClient.franchise.findUnique({
    where: { id: createdFranchise.id },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });
};

const storage = new Storage({
  projectId: "frency-api-408414",
  keyFilename: "https://storage.googleapis.com/frency/frency-api-408414-e752fb1588ca.json",
});
const bucket = storage.bucket("frency");

const uploadImages = async (franchiseId, request) => {
  const franchise = await prismaClient.franchise.findUnique({
    where: { id: parseInt(franchiseId) },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  let createdGallery = [];

  const gallery = request.files;

  if (gallery && gallery.length > 0) {
    createdGallery = await Promise.all(
      gallery.map(async (image) => {
        const fileName = Date.now() + "-" + image.originalname;
        const destination = "uploads/" + fileName;
        const gcsFile = bucket.file(destination);

        const stream = gcsFile.createWriteStream({
          metadata: { contentType: image.mimetype },
          public: true,
          validation: "md5",
        });

        const uploadPromise = new Promise((resolve, reject) => {
          stream.on("error", (err) => {
            logger.error(err);

            reject(err);
          });

          stream.on("finish", async () => {
            await prismaClient.gallery.create({
              data: {
                image: `https://storage.googleapis.com/frency/uploads/${fileName}`,
                franchise_id: parseInt(franchiseId),
              },
            });

            resolve();
          });

          stream.end(image.buffer);
        });

        await uploadPromise.catch((err) => {
          throw err;
        });
      })
    );
  }

  return await prismaClient.franchise.findUnique({
    where: { id: parseInt(franchiseId) },
    select: {
      id: true,
      franchise_name: true,
      address: true,
      description: true,
      category: true,
      whatsapp_number: true,
      franchisor: { select: { id: true, name: true } },
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });
};

const getMyFranchises = async (user) => {
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
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

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

  if (!franchise) throw new Error("Franchise not found !");

  let updatedFranchise;

  updatedFranchise = await prismaClient.franchise.update({
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
      franchiseType: {
        select: { type: { select: { id: true, franchise_type: true } } },
      },
      gallery: { select: { image: true } },
    },
  });

  if (franchiseType && franchiseType.length > 0) {
    await prismaClient.franchiseType.deleteMany({
      where: { franchise_id: franchiseData.id },
    });

    const createdFranchiseType = await Promise.all(
      franchiseType.map(async (type_id) => {
        const createdAssociation = await prismaClient.franchiseType.create({
          data: { franchise_id: franchiseData.id, type_id },
        });
        return createdAssociation;
      })
    );

    updatedFranchise.franchiseType = createdFranchiseType;
  }

  return updatedFranchise;
};

const remove = async (user, id) => {
  id = validate(getFranchiseValidation, id);

  const franchise = await prismaClient.franchise.count({
    where: { franchisor_id: user.id, id },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return await prismaClient.franchise.delete({ where: { id } });
};

// const search = async (request) => {
//   request = validate(searchFranchiseValidation, request);

//   // 1 ((page - 1) * size) = 0
//   // 2 ((page - 1) * size) = 10
//   const skip = (request.page - 1) * request.size;

//   const filters = [];
//   if (request.franchise_name) {
//     filters.push({
//       franchise_name: {
//         contains: request.name,
//       },
//     });
//   }
//   if (request.address) {
//     filters.push({
//       address: {
//         contains: request.address,
//       },
//     });
//   }
//   if (request.description) {
//     filters.push({
//       description: {
//         contains: request.description,
//       },
//     });
//   }
//   if (request.category) {
//     filters.push({
//       category: {
//         contains: request.category,
//       },
//     });
//   }
//   if (request.whatsapp_number) {
//     filters.push({
//       whatsapp_number: {
//         contains: request.whatsapp_number,
//       },
//     });
//   }

//   const franchises = await prismaClient.franchise.findMany({
//     where: {
//       AND: filters,
//     },
//     take: request.size,
//     skip: skip,
//   });

//   const totalItems = await prismaClient.franchise.count({
//     where: {
//       AND: filters,
//     },
//   });

//   return {
//     data: franchises,
//     paging: {
//       page: request.page,
//       total_item: totalItems,
//       total_page: Math.ceil(totalItems / request.size),
//     },
//   };
// };

export default {
  getAll,
  get,
  create,
  uploadImages,
  getMyFranchises,
  update,
  remove,
  // search,
};
