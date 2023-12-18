import userService from "../service/user-service.js";

const register = async (req, res, next) => {
  try {
    const result = await userService.register(req.body);

    res.status(200).json({
      success: true,
      message: "Register Successfully !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await userService.login(req.body);

    res.status(200).json({
      success: true,
      message: "Login Success !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const logout = async (req, res, next) => {
  try {
    await userService.logout(req.user.id);

    res.status(200).json({
      success: true,
      message: "Logout Success !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const getAll = async (req, res, next) => {
  try {
    const result = await userService.getAll();

    res.status(200).json({
      success: true,
      message: "Success grabbing user data !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const id = req.user.id;
    const result = await userService.get(id);

    res.status(200).json({
      success: true,
      message: "Success grabbing user data !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    const id = req.user.id;
    const request = req.body;
    request.id = id;

    const result = await userService.update(request);
    res.status(200).json({
      success: true,
      message: "User data updated successfully !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default {
  register,
  login,
  logout,
  getAll,
  get,
  update,
};
