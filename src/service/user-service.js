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

const register = async (request) => {
  const user = validate(registerUserValidation, request);

  const countUser = await prismaClient.user.count({
    where: { email: user.email },
  });

  if (countUser === 1)
    throw new ResponseError(400, "Email already registered !");

  user.password = await bcrypt.hash(user.password, 10);

  return await prismaClient.user.create({ data: user });
};

const login = async (request) => {
  const loginRequest = validate(loginUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: { email: loginRequest.email },
  });

  if (!user) throw new ResponseError(401, "Email is unregistered !");

  const isPasswordValid = await bcrypt.compare(
    loginRequest.password,
    user.password
  );

  if (!isPasswordValid)
    throw new ResponseError(401, "Credentials isn't match !");

  const token = uuid().toString();

  return await prismaClient.user.update({
    data: { token },
    where: { id: user.id },
  });
};

const logout = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({ where: { id } });

  if (!user) throw new ResponseError(404, "User not found !");

  return await prismaClient.user.update({
    where: { id },
    data: { token: null },
  });
};

const getAll = async () => {
  const user = await prismaClient.user.findMany();

  if (!user) throw new ResponseError(404, "User not found !");

  return user;
};

const get = async (id) => {
  id = validate(getUserValidation, id);

  const user = await prismaClient.user.findUnique({ where: { id } });

  if (!user) throw new ResponseError(404, "User not found !");

  return user;
};

const update = async (request) => {
  const updateRequest = validate(updateUserValidation, request);

  const user = await prismaClient.user.findUnique({
    where: { id: updateRequest.id },
  });

  if (!user) throw new ResponseError(404, "User not found !");

  const data = {};
  if (updateRequest.name) data.name = updateRequest.name;
  if (updateRequest.email) data.email = updateRequest.email;
  if (updateRequest.role) data.role = updateRequest.role;
  if (updateRequest.password)
    data.password = await bcrypt.hash(updateRequest.password, 10);

  return await prismaClient.user.update({
    where: { id: updateRequest.id },
    data,
  });
};

export default {
  register,
  login,
  logout,
  getAll,
  get,
  update,
};
