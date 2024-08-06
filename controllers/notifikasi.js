const { sendNotificationService } = require('../middleware/firebase');

const sendNotification = async (req, res) => {
  const { token, message } = req.body;

  if (!message) {
    return res.status(400).json({ message: 'Pesan harus diisi.' });
  }

  try {
    await sendNotificationService(token,message);
    res.status(200).json({ message: 'Notifikasi berhasil dikirim' });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ message: 'Gagal mengirim notifikasi' });
  }
};

module.exports = { sendNotification };
