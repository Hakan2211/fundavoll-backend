import Category from "../../models/category/Category.js";
import validateMongoDbID from "../../utils/validateMongoDbID.js";
import { StatusCodes } from "http-status-codes";
import fs from "fs";
import cloudinaryUploadImg, { cloudinary } from "../../utils/cloudinary.js";
import streamifier from "streamifier";

const uploadFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
        folder: "Category",
      },
      (error, result) => {
        console.log("upload stream result", { error, result });
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    streamifier.createReadStream(buffer).pipe(cld_upload_stream);
  });
};

//----------------------------------------------------------------
// Create Category
//----------------------------------------------------------------
const createCategory = async (req, res) => {
  // const localPath = `${req.file.filename}`;
  console.log("in create cat", req.file.optimisedImage, req.file);
  // const imgUploaded = await cloudinaryUploadImg(req.file.filename, "Category");
  const data = await cloudinaryUploadImg(req.file.optimisedImage, "Category");
  console.log("data?", data);

  try {
    const category = await Category.create({
      user: req.user._id,
      title: req.body.title,
      // image: imgUploaded?.url,
      image: data?.secure_url || "",
    });
    res.status(StatusCodes.CREATED).json(category);
    // fs.unlinkSync(localPath);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Fetch All Categories
//----------------------------------------------------------------
const fetchCategories = async (req, res) => {
  try {
    const categories = await Category.find({})
      .populate("user")
      .sort("-createdAt");
    //.populate("post");
    res.status(StatusCodes.OK).json(categories);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Fetch Single Category
//----------------------------------------------------------------
const fetchCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const category = await Category.findById(id);
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
  res.json("Fetch Category");
};

//----------------------------------------------------------------
// Update Category
//----------------------------------------------------------------
const updateCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req.body?.title,
      },
      { new: true, runValidation: true }
    );
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
};

//----------------------------------------------------------------
// Delete Category
//----------------------------------------------------------------
const deleteCategory = async (req, res) => {
  const { id } = req.params;
  validateMongoDbID(id);

  try {
    const category = await Category.findByIdAndDelete(id);
    res.status(StatusCodes.OK).json(category);
  } catch (error) {
    res.json(error);
  }
};

export {
  createCategory,
  fetchCategories,
  fetchCategory,
  updateCategory,
  deleteCategory,
};
