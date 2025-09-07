const multer = require("multer");
const path = require("path");

// مكان تخزين الصور
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // __dirname = src/middlewares
    cb(null, path.join(__dirname, "../../uploads")); 
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname); // الحفاظ على الامتداد
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  },
});

// فلترة الملفات للتأكد أنها صور
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } }); // حد أقصى 5MB

module.exports = upload;
