const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const { authenticateToken, checkRole } = require('./middleware/authMiddleware');
const { login } = require('./controllers/authController');
const { getProfile, uploadProfilePicture, getProfilePicture, updateProfile, deleteMember } = require('./controllers/profileController');
const { addKamtibmas, getKamtibmas } = require('./controllers/kamtibmasController');
const { addLaluLintas, getLaluLintas } = require('./controllers/laluLintasController');
const { addBencana, getBencana } = require('./controllers/bencanaController');
const { getMembers, getTotalCounts, addUser, checkProfile, getMonthlyData, getUserById } = require('./controllers/userController');
const upload = require('./middleware/upload');
const imageUpload = require('./middleware/imageUpload');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Static file serving (Pastikan ini sesuai dengan penyimpanan Anda)
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/uploads', express.static(path.join('/tmp/uploads')));

// Auth routes
app.post('/login', login);

// Profile routes
app.get('/profile', authenticateToken, getProfile, checkRole);
app.post('/profile/upload', authenticateToken, imageUpload.single('profilePicture'), uploadProfilePicture);
app.get('/profile/picture/:userId', authenticateToken, getProfilePicture);
app.put('/profile', authenticateToken, updateProfile);

// Kamtibmas routes
app.post('/kamtibmas', authenticateToken, checkRole, upload.single('image'), addKamtibmas);
app.get('/kamtibmas', authenticateToken, getKamtibmas);

// Lalu Lintas routes
app.post('/lalu-lintas', authenticateToken, checkRole, upload.single('image'), addLaluLintas);
app.get('/lalu-lintas', authenticateToken, getLaluLintas);

// Bencana routes
app.post('/bencana', authenticateToken, checkRole, upload.single('image'), addBencana);
app.get('/bencana', authenticateToken, getBencana);

// User routes
app.get('/total', authenticateToken, checkRole, getTotalCounts);
app.get('/member', authenticateToken, checkRole, getMembers);
app.post('/tambah-anggota', authenticateToken, addUser);
app.get('/check-role', authenticateToken, checkRole, checkProfile);
app.delete('/delete-member/:id', authenticateToken, deleteMember);
app.post('/notifikasi', sendNotification);

app.get('/dashboard', getMonthlyData);
app.get('/users/:id', getUserById);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
