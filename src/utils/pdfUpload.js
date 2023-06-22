const multer = require('multer');
const multerStoragePdf = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public');
  },
  filename: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    cb(null, `files/admin-${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const multerFilterPdf = (req, file, cb) => {
  if (file.mimetype.split('/')[1] === 'pdf') {
    cb(null, true);
  } else {
    cb(new Error('Not a PDF File!!'), false);
  }
};

const uploadPdf = multer({
  storage: multerStoragePdf,
  fileFilter: multerFilterPdf,
});

module.exports = uploadPdf;
