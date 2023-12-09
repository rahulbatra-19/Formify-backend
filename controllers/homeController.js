const User = require("../models/User");
const mongoose = require("mongoose");
const fs = require("fs");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const bucket = "rahul-formbuilder-app";
async function uploadToS3(path, originalFilename, mimetype) {
  const client = new S3Client({
    region: "us-east-1",
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    },
  });
  const parts = originalFilename.split(".");
  const ext = parts[parts.length - 1];
  const newFilename = Date.now() + "." + ext;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Body: fs.readFileSync(path),
      Key: newFilename,
      ContentType: mimetype,
      ACL: "public-read",
    })
  );
  return `https://${bucket}.s3.amazonaws.com/${newFilename}`;
}

module.exports.upload = async function (req, res) {
   mongoose.connect(process.env.MONGODB_URI);

  try {
    const { path, originalname, mimetype } = req.file;
    const url = await uploadToS3(path, originalname, mimetype);
    res.json(url);
  } catch (err) {
    return res.status(500).json({ error: "Error in creating question", err });
  }
};
