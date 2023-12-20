import { prismaClient } from "../application/database.js";
import { validate } from "../validation/validation.js";
import { registerUserValidation, loginUserValidation, updateUserValidation } from "../validation/user-validation.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { Storage } from "@google-cloud/storage";
import { logger } from "../application/logging.js";

const register = async (request) => {
  const registerRequest = validate(registerUserValidation, request);

  const emailCheck = await prismaClient.user.findUnique({ where: { email: registerRequest.email } });
  if (emailCheck) throw new ResponseError(400, "Email already registered !");

  let usernameCheck = false;
  if (registerRequest.username) usernameCheck = await prismaClient.user.findUnique({ where: { username: registerRequest.username } });
  if (registerRequest.username === "") registerRequest.username = null;
  if (usernameCheck) throw new ResponseError(400, "Username already registered !");

  registerRequest.password = await bcrypt.hash(registerRequest.password, 10);

  return await prismaClient.user.create({ data: registerRequest });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({ where: { email: loginRequest.email } });
  if (!user) throw new ResponseError(401, "Email is unregistered !");

  const isPasswordMatch = await bcrypt.compare(loginRequest.password, user.password);
  if (!isPasswordMatch) throw new ResponseError(401, "Credentials isn't match !");

  const token = uuid().toString();

  return await prismaClient.user.update({
    data: { token: token },
    where: { id: user.id },
  });
};

const logout = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({ where: { id } });
  if (!user) throw new ResponseError(404, "User not found !");

  return await prismaClient.user.update({
    where: { id },
    data: { token: null }
  });
};

const getAll = async () => {
  const user = await prismaClient.user.findMany({ include: { franchise: true, favorite: true } });
  if (!user) throw new ResponseError(404, "User not found !");

  return user;
};

const get = async (id) => {
  const user = await prismaClient.user.findUnique({ where: { id }, include: { franchise: true, favorite: true } });
  if (!user) throw new ResponseError(404, "User not found !");

  return user;
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

const update = async (request) => {
  const updateRequest = validate(updateUserValidation, request.body);

  const user = await prismaClient.user.findUnique({ where: { id: updateRequest.id } });
  if (!user) throw new ResponseError(404, "User not found !");

  const updateData = {
    name: updateRequest.name ? updateRequest.name : user.name,
    email: updateRequest.email ? updateRequest.email : user.email,
    phone: updateRequest.phone ? updateRequest.phone : user.phone,
    gender: updateRequest.gender ? updateRequest.gender : user.gender,
  };

  updateRequest.avatar = user.avatar;
  if (request.files.avatar) {
    const fileName = Date.now() + "-" + image.originalname;
    const gcsFile = storage.bucket("frency").file("avatar/" + fileName);

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
        updateData.avatar = `https://storage.googleapis.com/frency/avatar/${fileName}`;

        resolve();
      });

      stream.end(image.buffer);
    });

    await uploadPromise.catch((err) => { throw err });
  };

  let emailCheck = false;
  if (updateRequest.email !== user.email) emailCheck = await prismaClient.user.findUnique({ where: { email: updateRequest.email } });
  if (emailCheck) {
    throw new ResponseError(400, "Email already registered !");
  } else {
    updateData.email = updateRequest.email;
  };

  let usernameCheck = false;
  if (updateRequest.username !== user.username) usernameCheck = await prismaClient.user.findUnique({ where: { username: updateRequest.username } });
  if (usernameCheck) {
    throw new ResponseError(400, "Username already registered !");
  } else {
    updateData.email = updateRequest.email;
  }
  
  if (updateRequest.password && (updateRequest.password !== "")) updateData.password = await bcrypt.hash(updateRequest.password, 10);
  
logger.info(updateRequest.id);
logger.info(updateData.id);

  return await prismaClient.user.update({
    where: { id: updateRequest.id },
    data: updateData,
  });
};

export default { register, login, logout, getAll, get, update };
