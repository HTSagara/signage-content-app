// src/pages/api/uploadImage.js
import { IncomingForm } from "formidable";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs"; // Add this import
import { Readable } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for handling form data
  },
};

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      // Parse the incoming form data
      const form = new IncomingForm({ multiples: false });

      form.parse(req, async (err, fields, files) => {
        if (err) {
          console.error("Error parsing the form:", err);
          return res.status(500).json({ error: "Failed to parse form data" });
        }

        const file = files.file[0]; // Assuming "file" is the field name

        // Convert the file to a readable stream
        const filePath = file.filepath; // Path to the uploaded file
        const stream = fs.createReadStream(filePath);

        // Upload to Cloudinary
        const uploadResponse = await new Promise((resolve, reject) => {
          const cloudinaryStream = cloudinary.uploader.upload_stream(
            { folder: "canvas_images" },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          stream.pipe(cloudinaryStream); // Pipe the stream to Cloudinary
        });

        // Return the Cloudinary URL
        return res.status(200).json({ url: uploadResponse.secure_url });
      });
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      return res.status(500).json({ error: "Image upload failed." });
    }
  } else {
    return res.status(405).json({ error: "Method not allowed" });
  }
}
