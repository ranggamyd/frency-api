import favoriteService from "../service/favorite-service.js";

const getFavorites = async (req, res, next) => {
  try {
    const result = await favoriteService.getAll(req.user);

    res.status(200).json({
      success: true,
      message: "Success grabbing favorited franchise !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const favorite = async (req, res, next) => {
  try {
    await favoriteService.favorite(req.user, req.params.franchiseId);

    res.status(200).json({
      success: true,
      message: "Franchise successfully added to favorite !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

const unfavorite = async (req, res, next) => {
  try {
    await favoriteService.unfavorite(req.user, req.params.franchiseId);

    res.status(200).json({
      success: true,
      message: "Franchise successfully removed from favorite !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

export default { getFavorites, favorite, unfavorite };
