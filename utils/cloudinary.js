import cloudinary from "cloudinary";
import dotenv from "dotenv";
import streamifier from "streamifier";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

const cloudinaryUploadImg = async (fileToUploadBuffer, folder) => {
  // try {
  //   const data = await cloudinary.v2.uploader.upload(fileToUpload, {
  //     resource_type: "auto",
  //     folder: folder,
  //   });
  //   return {
  //     url: data?.secure_url,
  //   };
  // } catch (error) {
  //   return error;
  // }
  return new Promise((resolve, reject) => {
    const cld_upload_stream = cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
        folder,
      },
      (error, result) => {
        console.log("upload stream result", { error, result });
        if (error) {
          return reject(error);
        }
        return resolve(result);
      }
    );

    streamifier.createReadStream(fileToUploadBuffer).pipe(cld_upload_stream);
  });
};

export default cloudinaryUploadImg;
