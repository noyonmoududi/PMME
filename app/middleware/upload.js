const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './resources/temp/');
  },
  filename: function (req, file, cb) {
    let date = new Date();
    let ext = file.originalname.split('.');
    ext = ext[ext.length - 1];
    cb(null, date.valueOf() + '.' + ext);
  }
});

const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype == 'application/pdf') {
    cb(null, true);
  } else {
    cb(null, false);
    req.error_message = 'jpeg, png, pdf is allowed only'
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

module.exports = upload;