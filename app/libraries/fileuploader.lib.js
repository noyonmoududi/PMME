// external imports
const multer = require("multer");
const path = require("path");
const createError = require("http-errors");
const fs = require('fs');

function uploader(
  subfolder_path,
  allowed_file_types,
  max_file_size,
  error_msg,
  UPLOADS_FOLDER
) {
  const filesDir = UPLOADS_FOLDER;

    // check if directory exists
    if (!fs.existsSync('./public/file_storage')) {
      // if not create directory
          fs.mkdirSync('./public/file_storage');
    }
    if (!fs.existsSync(filesDir)) {
    // if not create directory
        fs.mkdirSync(filesDir);

    }
  // define the storage
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
    },
    filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
        file.originalname
          .replace(fileExt, "")
          .toLowerCase()
          .split(" ")
          .join("-") +
        "-" +
        Date.now();
        if (fileExt != '') {
          cb(null, fileName + fileExt);
        } else {
          cb(createError("This File Is not supported."));
        }
    },
  });

  // preapre the final multer upload object
  const upload = multer({
    storage: storage,
    limits: {
      fileSize: max_file_size,
    },
    fileFilter: (req, file, cb) => {
      if (allowed_file_types.includes(file.mimetype)) {
        cb(null, true);
      } else {
        console.log(`${file.mimetype} File Is not supported!.`);
        cb(createError(error_msg));
      }
    },
  });

  return upload;
}

module.exports = uploader;
