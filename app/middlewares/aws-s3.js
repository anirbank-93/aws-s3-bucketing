const { S3 } = require('aws-sdk');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

exports.s3V2 = async (files) => {
  const S3_CLIENT = new S3();

  // let filetype = '';

  // if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
  //   filetype = 'jpeg';
  // } else if (file.mimetype === 'image/png') {
  //   filetype = 'png';
  // }

  // const param = {
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Key: `uploads/${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}.${filetype}`,
  //   Body: file.buffer,
  // };
  // return await S3_CLIENT.upload(params).promise();
  const params = files.map((file) => {
    let filetype = '';

    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      filetype = 'jpeg';
    } else if (file.mimetype === 'image/png') {
      filetype = 'png';
    }

    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}.${filetype}`,
      Body: file.buffer,
    };
  });

  // console.log(params);

  return await Promise.all(
    params.map((param) => S3_CLIENT.upload(param).promise())
  );
};

exports.s3v3 = async (files) => {
  const S3_CLIENT = new S3Client();

  // let filetype = '';

  // if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
  //   filetype = 'jpeg';
  // } else if (file.mimetype === 'image/png') {
  //   filetype = 'png';
  // }

  // const param = {
  //   Bucket: process.env.AWS_BUCKET_NAME,
  //   Key: `uploads/${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}.${filetype}`,
  //   Body: file.buffer,
  // };

  // return await S3_CLIENT.send(new PutObjectCommand(param));

  const params = files.map((file) => {
    let filetype = '';

    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
      filetype = 'jpeg';
    } else if (file.mimetype === 'image/png') {
      filetype = 'png';
    }

    return {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `uploads/${new Date().getDate()}${new Date().getHours()}${new Date().getSeconds()}${new Date().getMilliseconds()}.${filetype}`,
      Body: file.buffer,
    };
  });

  return await Promise.all(
    params.map((param) => S3_CLIENT.send(new PutObjectCommand(param)))
  );
};
