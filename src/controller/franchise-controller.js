import { logger } from "../application/logging.js";
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
    const franchiseId = req.params.franchiseId;
    const result = await franchiseService.get(franchiseId);

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
    const user = req.user;
    const request = req.body;
    const result = await franchiseService.create(user, request);

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
    const franchiseId = req.params.franchiseId;
    const request = req;
    const result = await franchiseService.uploadImages(franchiseId, request);

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
    const user = req.user;
    const result = await franchiseService.getMyFranchises(user);

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
    const user = req.user;
    const franchiseId = req.params.franchiseId;
    const request = req.body;
    request.id = franchiseId;

    const result = await franchiseService.update(user, request);

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
    const user = req.user;
    const franchiseId = req.params.franchiseId;

    await franchiseService.remove(user, franchiseId);
    res.status(200).json({
      success: true,
      message: "Franchise data deleted successfully !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

// const search = async (req, res, next) => {
//   try {
//     const request = {
//       franchise_name: req.query.franchise_name,
//       address: req.query.address,
//       description: req.query.description,
//       category: req.query.category,
//       whatsapp_number: req.query.whatsapp_number,
//       page: req.query.page,
//       size: req.query.size,
//     };

//     const result = await franchiseService.search(request);

//     res.status(200).json({
//       success: true,
//       message: "Franchise data founded !",
//       data: result.data,
//       paging: result.paging,
//     });
//   } catch (e) {
//     next(e);
//   }
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
