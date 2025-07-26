const {
  v2: cloudinary
} = require('cloudinary');
const streamifier = require('streamifier')

// Configure Cloudinary with environment variables
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET
});

// End Configure Cloudinary with environment variables


// Middleware function to handle file uploads to Cloudinary
module.exports.upload = (req, res, next) => {
  // Check if a file is uploaded
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream(
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      // Upload the file to Cloudinary
      // and wait for the result
      let result = await streamUpload(req);
      // Save the URL to the request body
      req.body[req.file.fieldname] = result.secure_url;

      // Continue to the next middleware
      next();
    }
    upload(req);
  } else {
    // If no file is uploaded, continue to the next middleware
    next();
  }
}