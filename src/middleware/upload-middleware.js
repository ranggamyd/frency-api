import multer from "multer";

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Tentukan direktori penyimpanan file
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname); // Ubah nama file
  },
});

// Filter untuk menerima hanya tipe file tertentu (jika diperlukan)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true); // Terima file jika tipe adalah gambar
  } else {
    cb(new Error("Only images are allowed."), false); // Tolak file jika bukan gambar
  }
};

// Konfigurasi upload untuk multiple files
const uploadMiddleware = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { files: 5 },
}).array("gallery", 10); // Mengizinkan hingga 5 file dengan field 'images'

export { uploadMiddleware };
