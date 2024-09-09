const express = require("express");
const Article = require("../models/article"); 
const router = express.Router();
const s3 = require("../config/s3Config");
const upload = require("../config/uploadConfig");
const { v4: uuidv4 } = require("uuid"); 


router.post("/upload-article", upload.single("file"), (req, res) => {
  const file = req.file;
  const { title, description } = req.body; 
  if (!file || !title || !description) {
    return res.status(400).json({ error: 'All fields are required: file, title, and description' });
  }

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/[-:.]/g, ''); 
  };

  const timestamp = getCurrentTimestamp(); 
  const uuid = uuidv4();
  key = `${uuid}-${timestamp}-${file.originalname}`;

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  s3.upload(params, async (err, data) => {
    if (err) {
      console.error('Error uploading file:', err);
      return res.status(500).json({ error: 'Error uploading file' });
    }

    try {
      const newArticle = new Article({
        title,
        description,
        imageUrl: data.Location, 
      });

      await newArticle.save();

      res.json({ message: 'Article and file uploaded successfully', article: newArticle });
    } catch (dbError) {
      console.error('Error saving article:', dbError);
      res.status(500).json({ error: 'Error saving article' });
    }
  });
});

module.exports = router;
