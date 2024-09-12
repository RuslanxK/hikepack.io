const s3 = require("../config/s3Config");

async function deleteFile(imageUrl) {
  const key = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
  console.log('Deleting file with key:', key);

  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: decodeURIComponent(key),
  };

  try {
    const data = await s3.deleteObject(params).promise();
    console.log('File deleted successfully from S3:', data);
  } catch (error) {
    console.error('Error deleting file from S3:', error);
    throw new Error('Failed to delete file from S3');
  }
}

module.exports = { deleteFile };