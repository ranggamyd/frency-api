import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { createFranchiseValidation, updateFranchiseValidation, searchFranchiseValidation } from "../validation/franchise-validation.js";
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
      franchiseType: true,
      gallery: true,
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
      franchiseType: true,
      gallery: true,
    },
  });

  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  return franchise;
};

const create = async (user, request) => {
  const { franchiseType, ...franchiseData } = validate(createFranchiseValidation, request);
  franchiseData.franchisor_id = user.id;

  const createdFranchise = await prismaClient.franchise.create({ data: franchiseData });

  if (franchiseType && (franchiseType.length > 0)) {
    await Promise.all(
      franchiseType.map(async (item) => {
        return await prismaClient.franchiseType.create({ data: { franchise_id: createdFranchise.id, franchise_type: item.franchise_type, facility: item.facility, price: item.price } });
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
      franchiseType: true,
      gallery: true,
    },
  });
};

const storage = new Storage({
  projectId: "frency-api-408414",
  credentials: {
    type: "service_account",
    project_id: "frency-api-408414",
    private_key_id: "e752fb1588cab864dc91c07c471283c09fb0356f",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDF63IEIcHZpVdt\n6N84rMIix6b0u5IyLG15oWEGvVa5s3k6OS2hL78e1/VnM11ZjvV6sQ82hLDExMK1\nYa0EC8z/A1167Y9aUWxxoT/8bkXHjKD/XAHCwy1KuehbOJeUgX7Ov5WT62GyApFx\npKwv9zPErCR/eKeY7NTWk5zU49/dHWhIOSmNYbREYgrABmXszn622IFPhttMLZ8c\nXSduHBNFBVEgQJE0cf32V6yaM2cQad3uYycXGfMdF6Rtb6B7/USE+tUlj0WvA4TJ\ndmf3T/bDTeSOKjI27oaewm7dvU8v0AD+kjXv/tovKBy+vB0HiEynJAo103frfYoX\nqx+FbRIdAgMBAAECggEAGHc9EOWwtjGKLTwBhq//D5g+kIzfSvR9qUYZswuUvOqY\nAb/aXs0tgv053hgAt3bElvYW5gELw5x5tTzty6I/JQb1d0yxJn5fjsGwId7qdqXG\nVnVj16o+NGPmz9/0XOyPuwmpI9qPqRby2RQndNvKD8sid993rZ/DxQKvpbbFkD+V\nR7rw21sAPW4iw3rpWx/pSqXZJ+KEdkmu5WgHZQOPbnM2ptOrs6LgmoMoOwe11NQC\n3qcfImUJianpsDpmjRQULLh3hefHTXfssRJD3e2NSHaO+jIqq3KdTMi0xuXsI4uC\nGrnI1xcK98CHhzK0dN1TSBMoRWCGqs4glTIU3XHYwQKBgQDvhvHUtjZySoRULJ7w\nFfC2nclqDwoSXATOIthmRvoWKX7O7GYuwvbK4EuWXNYK9nyZK0DvPyXyWKduDT4U\nOO1cRL1eVyyLfv07g5PpVXNpar715axGpzM2Ruf+phEWMDtFUjM1n9t8ADSVzXd+\nHqtlON0P3zbzFQixXPRf2LhmywKBgQDTh/iGMJ8tp4FaAC5CajUcMt8biW4RzYAe\n3X3yHt2XwZ1Eiib8lm9EsihQRZ/nFLp3PNXGShYBpqrsk0xMfTTx1P3LH6PebLhw\nwyMOC/3nfS1JIs9V+wD6aTDYjR4N5F/N2KgICbIMput12FbKfR1c5TnSS4wgtXDy\nlAkuE/jltwKBgQCqcnCsWW2tLvGzpH0Fg9djXCzz1/fm0Kxqs8kiHuff1W9zeC3O\noNZVz/555V47NuO7a1gt59Xs+sFKQwomAcyGmDPZalc8fQVe0Gb05+XU4i05dlJ9\nhIWg3hxAzZPjIjdLQQ9H3ZWmS88furKJgPGeejR1EvZbTGB/NhKAEgxGuQKBgQCl\n7kY8dU2YUYp9YCDphkitGxa6kh6epnY3QAX49M9cqMtGJZ0ZjKQx3hMTjNo3OaJf\nwH/s8Na8atIvjAhRA/KRNUP0n5g69UvlYJ1R+oQsn5vzf/PmfWQyCmv/owsNWLTy\nU17UF07s789KfO7wHh73bPTjitGcItg74XYmCBK5lwKBgCgPVTsRANmbgxbE/CaN\nyLXEq2KHRbXjWfFX1RUtFgcsV9CPC+gyzqXRDXjzomqkbndP+h15KsAfUGkFmMFM\npREE9G0q3zGSPbPvmAR8+qU77dtPC4iX8vSU97Vd0hdexw+ktGqHzCEZ81nRq8nm\npqDKO3k9ixRrvSNccrT0iHyy\n-----END PRIVATE KEY-----\n",
    client_email: "service-account@frency-api-408414.iam.gserviceaccount.com",
    client_id: "114426157307452980725",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/service-account%40frency-api-408414.iam.gserviceaccount.com",
    universe_domain: "googleapis.com",
  },
});

const uploadImages = async (franchiseId, request) => {
  if (user.role.toLowerCase() != "franchisor") throw new ResponseError(401, "Access Forbidden !");

  const franchise = await prismaClient.franchise.findUnique({ where: { id: parseInt(franchiseId) } });
  if (!franchise) throw new ResponseError(404, "Franchise not found !");

  const gallery = request.files;
  if (gallery.length === 0) throw new ResponseError(401, "Image file is required !");

  if (gallery && gallery.length > 0) {
    await Promise.all(
      gallery.map(async (image) => {
        const fileName = Date.now() + "-" + image.originalname;
        const gcsFile = storage.bucket("frency").file("uploads/" + fileName);

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

        await uploadPromise.catch((err) => { throw err });
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
      franchiseType: true,
      gallery: true,
    },
  });
};

const getMyFranchises = async (user) => {
  if (user.role.toLowerCase() != "franchisor") throw new ResponseError(401, "Access Forbidden !");

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

export default { getAll, get, create, uploadImages, getMyFranchises, update, remove, search };

