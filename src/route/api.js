import express from "express";
import userController from "../controller/user-controller.js";
import franchiseController from "../controller/franchise-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";

const userRouter = new express.Router();

userRouter.use(authMiddleware);

// User API
userRouter.get("/users", userController.getAll);
userRouter.get("/users/current", userController.get);
userRouter.patch("/users/current", userController.update);
userRouter.delete("/users/logout", userController.logout);

// Franchise API
userRouter.get("/franchises", franchiseController.getAll);
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
// userRouter.get("/franchises", franchiseController.search);

export { userRouter };
