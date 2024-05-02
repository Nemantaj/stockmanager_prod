const multer = require("multer");
const path = require("path");
const aws = require("aws-sdk");
const multerS3 = require("multer-s3");

aws.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKeyId: process.env.AWS_SECRET_ACCESS_KEY,
});

var s3 = new aws.S3();

const fileStorage = multerS3({
  s3: s3,
  acl: "public-read",
  bucket: process.env.BUCKET,
  key: (req, file, cb) => {
    cb(
      null,
      "seller-documents/" +
        new Date().toISOString().replace(/:/g, "-") +
        Math.random() * 100 +
        path.extname(file.originalname)
    );
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "application/pdf"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

exports.singleUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single("images");

exports.multiUpload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).array("images", 5);

exports.deleteMultiple = (objects) => {
  console.log(objects);
  s3.deleteObjects(
    { Bucket: process.env.BUCKET, Delete: { Objects: objects } },
    (err, data) => {
      if (data) {
        console.log("Deleted!");
      } else {
        console.log(err);
      }
    }
  );
};
