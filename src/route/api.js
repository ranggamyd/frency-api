import express from "express";
import userController from "../controller/user-controller.js";
import franchiseController from "../controller/franchise-controller.js";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { uploadMiddleware } from "../middleware/upload-middleware.js";

const userRouter = new express.Router();
userRouter.use(authMiddleware);

// User API
userRouter.post("/api/users", userController.register);
userRouter.get("/api/users", userController.getAll);
userRouter.get("/api/users/current", userController.get);
userRouter.patch("/api/users/current", userController.update);
userRouter.delete("/api/users/logout", userController.logout);

// Franchise API
userRouter.post("/api/franchises", franchiseController.create);
userRouter.post(
  "/api/franchises/:franchiseId/upload",
  uploadMiddleware,
  franchiseController.uploadImages
);
userRouter.get("/api/franchises", franchiseController.getAll);
userRouter.get("/api/my_franchises", franchiseController.getMyFranchises); // Posted By Franchisor
userRouter.get("/api/franchises/:franchiseId", franchiseController.get);
userRouter.put("/api/franchises/:franchiseId", franchiseController.update);
userRouter.delete("/api/franchises/:franchiseId", franchiseController.remove);
userRouter.get("/api/franchises", franchiseController.search);

export { userRouter };
