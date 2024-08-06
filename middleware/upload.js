const multer = require('multer');
const path = require('path');

<<<<<<< HEAD
// Folder penyimpanan yang diizinkan di Vercel
const UPLOAD_DIR = '/tmp/uploads';

// Buat direktori jika belum ada
const fs = require('fs');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOAD_DIR);
=======
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads');
>>>>>>> 6995891428d9521cf360657a9b86eae59f3b40ad
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

module.exports = upload;
