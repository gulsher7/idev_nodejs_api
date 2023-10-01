const multer = require('multer');
const path = require('path');
const util = require('util')


const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    },
  });
  

  function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif|mp4|mov|png/;

    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    const mimetype = filetypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Error: Images only (jpeg, jpg, png, gif, mp4, mov, png)!');
    }
  }

  const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
      checkFileType(file, cb);
    },
  }).array('file', 5); 
  
  const uploadMiddleWare = util.promisify(upload)

  module.exports = uploadMiddleWare
 
  
