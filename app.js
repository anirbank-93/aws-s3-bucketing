/** Only lines needed to start a nodejs server with express */
const express = require('express'); //** */
const multer = require('multer');
const path = require('path');
const { s3V2, s3v3 } = require('./app/middlewares/aws-s3');

require('dotenv').config();

const app = express(); //** */

/** ------------- Single file upload ------------- */
// const upload = multer({ dest: 'public/uploads' });
/** ---------------------------------------------- */

/** ----------- Multiple files uploads ----------- */
// Multiple files via a single input field
const upload = multer({ dest: 'public/uploads' });
// Multiple files via multiple upload field
const storage2 = multer.diskStorage({
  // Holds a buffer of the file in disk
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    // console.log(file, "multer mw");
    if (file.fieldname == 'file1') {
      var file1 = file.originalname.split(' ').join('-');
      file = file1;

      cb(null, file);
    }
    if (file.fieldname == 'file2') {
      var file2 = file.originalname.split(' ').join('-');
      file = file2;

      cb(null, file);
    }
  },
});
var upload2 = multer({ storage: storage2 });
var uploadMultiple = upload2.fields([
  { name: 'file1', maxCount: 2 },
  { name: 'file2', maxCount: 2 },
]);
/** ---------------------------------------------- */

const fileFilter = (req, file, cb) => {
  console.log(file.mimetype);
  if (file.mimetype.split('/')[0] === 'image') {
    cb(null, true);
  } else {
    cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE'), false);
  }
};

const storage3 = multer.memoryStorage();
const upload3 = multer({
  storage3,
  fileFilter,
  limits: { fileSize: 1000000000, files: 2 },
});

app.post('/upload', upload.single('file'), (req, res, next) => {
  res.send({ message: 'Success' });
});
app.post('/upload_single_field', upload.array('files', 2), (req, res, next) => {
  res.send({ message: 'Success' });
});
app.post('/upload_many_fields', uploadMultiple, (req, res, next) => {
  res.send({ message: 'Success' });
});
app.post('/upload-s3v2', upload3.array('files'), async (req, res) => {
  // console.log(req.files);
  try {
    // const file = req.files[0];
    const results = await s3V2(req.files);
    console.log(results, 'aws bucket upload result');
    return res.json({ message: 'success' });
  } catch (err) {
    console.log(err.message, 'thisisis');
  }
});

app.post('/upload-s3v3', upload3.array('files'), async (req, res) => {
  // const file = req.files[0];

  try {
    // const file = req.files[0];
    const results = await s3v3(req.files);
    console.log(results, 'aws bucket upload result');
    return res.json({ message: 'success' });
  } catch (err) {
    console.log(err.message, 'thisisis');
  }
});

app.use('/uploads', express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 5000; //** */

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
}); //** */
