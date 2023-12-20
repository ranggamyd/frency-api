import multer from "multer";

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed !"), false);
  }
};

const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 10 },
}).array("gallery", 10);

const avatarMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
}).single("avatar");

export { uploadMiddleware, avatarMiddleware };
