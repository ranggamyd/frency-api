import favoriteService from "../service/favorite-service.js";

const getFavorites = async (req, res, next) => {
  try {
    const result = await favoriteService.getAll();

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
      message: "Favorited franchise successfully added !",
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
      message: "Favorited franchise successfully removed !",
      data: "OK",
    });
  } catch (e) {
    next(e);
  }
};

export default { getFavorites, favorite, unfavorite };
