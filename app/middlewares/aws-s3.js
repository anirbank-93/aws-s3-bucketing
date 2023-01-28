const { S3 } = require('aws-sdk');

exports.s3V2 = async (file) => {
  const S3_CLIENT = new S3();

  let filetype = '';

  if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
    filetype = 'jpeg';
  } else if (file.mimetype === 'image/png') {
    filetype = 'png';
  }

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `uploads/${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}.${filetype}`,
    Body: file.buffer,
  };
  return await S3_CLIENT.upload(params).promise();
};
