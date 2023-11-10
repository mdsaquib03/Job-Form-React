const fs = require('fs');
require('dotenv').config();
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');

const bucketName = process.env.AWS_BUCKET_NAME;
const region = process.env.AWS_BUCKET_REGION;
const accessKeyID = process.env.AWS_ACCESS_KEY;
const secretKey = process.env.AWS_SECRET_KEY;

const client = new S3Client({
    region,
    credentials: {
        accessKeyId: accessKeyID,
        secretAccessKey: secretKey,
    },
});

async function uploadFile(file, college, email, name) {
    // console.log(file);
    const fileStream = fs.createReadStream(file[0].path);
    const key = `${college}/${email}/${name}/${file[0].filename}`;

    const uploadParams = {
        Bucket: bucketName,
        Body: fileStream,
        Key: key,
    };

    const command = new PutObjectCommand(uploadParams);

    try {
        const response = await client.send(command);
        console.log('File uploaded successfully:', response);
        const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key}`
        return url;

        // const { Body } = await client.send(
        //     new GetObjectCommand({
        //         Bucket: bucketName,
        //         Key: key,
        //     })
        // );
        // console.log("body");
        // console.log(Body);
        // console.log("bodyend");

    } catch (error) {
        console.error('Error uploading file:', error);
    }
}

exports.uploadFile = uploadFile;
