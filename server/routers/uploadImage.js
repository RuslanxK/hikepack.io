const express = require('express');
const s3 = require('../config/s3Config');
const upload = require('../config/uploadConfig');
const { v4: uuidv4 } = require('uuid'); 


const router = express.Router();

router.post('/upload-image', upload.single('file'), (req, res) => {
  const file = req.file;
  const { imageUrl } = req.body; 


  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toISOString().replace(/[-:.]/g, '');
  };

  let key;
  if (imageUrl) {
    key = imageUrl.split('/').pop(); 
  } else {
    const timestamp = getCurrentTimestamp(); 
    const uuid = uuidv4();
    key = `${uuid}-${timestamp}-${file.originalname}`;
  }

  if (file) {
    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: key, 
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
        return res.status(500).json({ error: 'Error uploading file' });
      }
      res.json({ message: 'File uploaded successfully', data });
    });
  } else {
    res.status(400).json({ error: 'No file received' });
  }
});

module.exports = router;
