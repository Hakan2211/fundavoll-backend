import multer from "multer";
import sharp from "sharp";
import path from "path";

const multerStorage = multer.memoryStorage();
// const multerStorage = multer.diskStorage();

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb({ message: "Unsupported file format" }, false);
  }
};

const photoUploadMiddle = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
  limits: { fileSize: 20000000 },
});

//Image Resizing
const profilePhotoResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  const optimisedImage = await sharp(req.file.buffer)
    .resize(250, 250)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    // .toFile(path.join(`public/images/profile/${req.file.filename}`));
    .toBuffer();
  req.file.optimisedImage = optimisedImage;

  next();
};

const postImgResize = async (req, res, next) => {
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;

  const optimisedImage = await sharp(req.file.buffer)
    .resize(900, 900)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    // .toFile(path.join(`public/images/posts/${req.file.filename}`));
    .toBuffer();
  req.file.optimisedImage = optimisedImage;

  next();
};

const categoryImgResize = async (req, res, next) => {
  console.log("check  in categoryImgREsize", req.file);
  if (!req.file) return next();

  req.file.filename = `user-${Date.now()}-${req.file.originalname}`;
  const optimisedImage = await sharp(req.file.buffer)
    .resize(750, 750)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    // .toFile(path.join(`public/images/category/${req.file.filename}`));
    .toBuffer();

  req.file.optimisedImage = optimisedImage;
  next();
};

export {
  photoUploadMiddle,
  profilePhotoResize,
  postImgResize,
  categoryImgResize,
};
