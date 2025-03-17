const multer = require("multer");
const path = require("path");

const storage = (folder) => {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, `../public/images/${folder}`));
    },

    filename: (req, file, cb) => {
      cb(null, file.originalname);
    },
  });
};

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images Only!");
  }
}

const uploadImage = (folder) =>
  multer({
    storage: storage(folder),
    limits: { fileSize: 5000000 },
    fileFilter: (req, file, cb) => {
      checkFileType(file, cb);
    },
  }).single("image");

module.exports = { uploadImage };
