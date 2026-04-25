import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import fs from "fs";

const router = express.Router();

// store temporarily
const upload = multer({
  dest: "temp/",
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/", upload.single("avatar"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // upload to cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "avatars",
    });

    // delete temp file
    fs.unlinkSync(req.file.path);

    res.json({
      url: result.secure_url,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;