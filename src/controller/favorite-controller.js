import favoriteService from "../service/favorite-service.js";

const getFavoritedFranchises = async (req, res, next) => {
  try {
    const result = await favoriteService.getFavoritedFranchises(parseInt(req.user.id));

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
    const result = await favoriteService.favorite(parseInt(req.params.franchiseId), parseInt(req.user.id));

    res.status(200).json({
      success: true,
      message: "Franchise successfully added to favorite !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

const unfavorite = async (req, res, next) => {
  try {
    const result = await favoriteService.unfavorite(parseInt(req.params.franchiseId), parseInt(req.user.id));

    res.status(200).json({
      success: true,
      message: "Franchise successfully removed from favorite !",
      data: result,
    });
  } catch (e) {
    next(e);
  }
};

export default { getFavoritedFranchises, favorite, unfavorite };
