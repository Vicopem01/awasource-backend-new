const multer = require('multer');
const path = require('path');

const maxSize = 10 * 1000 * 1000;

module.exports = multer({
  storage: multer.diskStorage({}),
  fileFilter: (req, file, cb) => {
    let ext = path.extname(file.originalname);
    if (
      ext != '.mp4' &&
      ext != '.png' &&
      ext != '.jpg' &&
      ext != '.svg' &&
      ext != '.jpeg' &&
      ext !== '.MPEG-4'
    ) {
      cb(new Error('File type is not supported'), false);
      return;
    }
    cb(null, true);
  },
});
