const AWS = require('aws-sdk');
const region = process.env.AWS_REGION || 'us-east-1';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region
});

async function uploadBase64(base64String, keyPrefix = 'uploads/') {
  const buffer = Buffer.from(base64String, 'base64');
  const Key = `${keyPrefix}${Date.now()}.png`;
  await s3.putObject({
    Bucket: process.env.S3_BUCKET_NAME,
    Key,
    Body: buffer,
    ACL: 'public-read',
    ContentEncoding: 'base64',
    ContentType: 'image/png'
  }).promise();
  return `https://${process.env.S3_BUCKET_NAME}.s3.${region}.amazonaws.com/${Key}`;
}

module.exports = { uploadBase64 };
