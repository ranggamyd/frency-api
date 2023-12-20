import franchiseService from "../service/franchise-service.js";

const getAll = async (req, res, next) => {
  try {
    const result = await franchiseService.getAll();

    res.status(200).json({
      success: true,
      message: "Success grabbing franchise data !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const get = async (req, res, next) => {
  try {
    const result = await franchiseService.get(req.params.franchiseId);

    res.status(200).json({
      success: true,
      message: "Success grabbing franchise data !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const create = async (req, res, next) => {
  try {
    const result = await franchiseService.create(req.user, req.body);

    res.status(200).json({
      success: true,
      message: "Franchise data created successfully !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const uploadImages = async (req, res, next) => {
  try {
    const result = await franchiseService.uploadImages(req.params.franchiseId, req);

    res.status(200).json({
      success: true,
      message: "Franchise gallery uploaded successfully !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const getMyFranchises = async (req, res, next) => {
  try {
    const result = await franchiseService.getMyFranchises(req.user);

    res.status(200).json({
      success: true,
      message: "Success grabbing franchise data !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const update = async (req, res, next) => {
  try {
    req.body.id = req.params.franchiseId;

    const result = await franchiseService.update(req.user, req);

    res.status(200).json({
      success: true,
      message: "Franchise data updated successfully !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const remove = async (req, res, next) => {
  try {
    await franchiseService.remove(req.user, req.params.franchiseId);

    res.status(200).json({
      success: true,
      message: "Franchise data deleted successfully !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const search = async (req, res, next) => {
  try {
    const query = req.query;

    const request = {
      franchise_name: query.franchise_name,
      address: query.address,
      category: query.category,
      franchise_type: query.franchise_type,
      facility: query.facility,
      price: query.price,
    };

    const result = await franchiseService.search(request);

    res.status(200).json({
      success: true,
      message: "Franchise data founded !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { getAll, get, create, uploadImages, getMyFranchises, update, remove, search };
