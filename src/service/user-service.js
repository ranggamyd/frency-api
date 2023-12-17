import { validate } from "../validation/validation.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import { logger } from "../application/logging.js";

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: {
      email: user.email,
    },
  });

  if (countUser === 1) throw new ResponseError(400, "Email already exists");

  user.password = await bcrypt.hash(user.password, 10);

  return prismaClient.user.create({
    data: user,
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      token: true,
    },
  });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      email: loginRequest.email,
    },
  });

  if (!user) throw new ResponseError(401, "Email or password wrong");

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid) throw new ResponseError(401, "Email or password wrong");

  const token = uuid().toString();

  return prismaClient.user.update({
    data: {
      token: token,
    },
    where: {
      id: user.id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      token: true,
    },
  });
};

const getAll = async () => {
  const user = await prismaClient.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      token: true,
    },
  });

  if (!user) throw new ResponseError(404, "user is not found");

  return user;
};

const get = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      token: true,
    },
  });

  if (!user) throw new ResponseError(404, "user is not found");

  return user;
};

const update = async (request) => {
  const updateRequest = validate(updateUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: {
      id: updateRequest.id,
    },
  });

  if (!user) throw new ResponseError(404, "user is not found");

  const data = {};
  if (updateRequest.name) data.name = updateRequest.name;
  if (updateRequest.email) data.email = updateRequest.email;
  if (updateRequest.role) data.role = updateRequest.role;
  if (updateRequest.password)
    data.password = await bcrypt.hash(updateRequest.password, 10);

  return prismaClient.user.update({
    where: {
      id: updateRequest.id,
    },
    data: data,
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      token: true,
    },
  });
};

const logout = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({
    where: {
      id: id,
    },
  });

  if (!user) throw new ResponseError(404, "user is not found");

  return prismaClient.user.update({
    where: {
      id: id,
    },
    data: {
      token: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      password: true,
      role: true,
      token: true,
    },
  });
};

export default {
  register,
  login,
  getAll,
  get,
  update,
  logout,
};
