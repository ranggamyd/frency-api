import express from "express";
import userController from "../controller/user-controller.js";
import franchiseController from "../controller/franchise-controller.js";
// import typeController from "../controller/type-controller.js";
// import favoriteController from "../controller/favorite-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware, avatarMiddleware } from "../middleware/upload-middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);

// User API
userRouter.get("/users", userController.getAll);
userRouter.get("/users/current", userController.get);
userRouter.patch("/users/current", avatarMiddleware, userController.update);
userRouter.delete("/users/logout", userController.logout);

// Franchise API
userRouter.get("/franchises", franchiseController.getAll);
userRouter.get("/franchises/search", franchiseController.search);
userRouter.get("/franchises/:franchiseId", franchiseController.get);
userRouter.post("/franchises", franchiseController.create);
userRouter.post(
  "/franchises/:franchiseId/upload",
  uploadMiddleware,
  franchiseController.uploadImages
);
userRouter.get("/my_franchises", franchiseController.getMyFranchises); // Posted By Franchisor
userRouter.put("/franchises/:franchiseId", franchiseController.update);
userRouter.delete("/franchises/:franchiseId", franchiseController.remove);

// // Type API
// userRouter.get("/types", typeController.getAll);

// // Favorite API
// userRouter.get("/favorites", favoriteController.getAll);
// userRouter.post("/favorites", favoriteController.favorite);
// userRouter.delete("/favorites", favoriteController.unfavorite);

export { userRouter };
