const multer = require("multer");
const path = require("path");
const util = require("util");
const { S3Client } = require("@aws-sdk/client-s3");

const multerS3 = require("multer-s3");

const s3 = new S3Client({
  credentials: {
    secretAccessKey: process.env.S3_SECRET_KEY,
    accessKeyId: process.env.S3_ACCESS_KEY,
  },
  region: process.env.S3_REGION,
});

// Function to determine content type based on MIME type
function determineContentType(mimetype) {
  if (mimetype.startsWith("image/")) {
    return "image/jpeg"; // For images, set the content type to JPEG
  } else if (mimetype.startsWith("video/")) {
    return "video/mp4"; // For videos, set the content type to MP4
  } else if (mimetype.startsWith("application/pdf")) {
    return "application/pdf"; // For PDF files
  } else if (mimetype.startsWith("text/")) {
    return "text/plain"; // For text files
  } else if (mimetype.startsWith("audio/")) {
    return "audio/mpeg"; // For audio files
  } else {
    throw new Error("Invalid file type");
  }
}

const storage = multerS3({
  s3: s3,
  bucket: process.env.S3_BUCKET_NAME,
  // contentType: multerS3.AUTO_CONTENT_TYPE,
  contentType: function (req, file, cb) {
    try {
      const contentType = determineContentType(file.mimetype);
      cb(null, contentType);
    } catch (error) {
      cb(error);
    }
  },
  metadata: function (req, file, cb) {
    cb(null, { fieldName: file.fieldname });
  },
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpeg|jpg|png|gif|mp4|mov|png/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb("Error: Images/Videos only (jpeg, jpg, png, gif, mp4, mov, png)!");
  }
}

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    console.log("filefilefile", file);
    checkFileType(file, cb);
  },
});

const uploadMiddleWare = upload;

module.exports = uploadMiddleWare;
