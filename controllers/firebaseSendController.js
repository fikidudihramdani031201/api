const admin = require('firebase-admin');
const serviceAccount = require('../halogen-proxy-410816-250cfab65ff3.json');
const { getTokensFromDatabase } = require('../models/tokenModel');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Fungsi untuk mengirim notifikasi
const sendNotificationService = async (message, senderToken) => {
  try {
    // Ambil token dari database
    const tokens = await getTokensFromDatabase();

    // Filter token untuk menghindari pengirim
    const validTokens = tokens.filter(token => token !== senderToken);

    if (validTokens.length === 0) {
      console.log('No valid tokens to send notifications.');
      return;
    }

    // Payload notifikasi
    const payload = {
      notification: {
        title: 'Sriti',
        body: message, // Pesan yang akan ditampilkan
      },
      android: {
        notification: {
          channel_id: 'my-channel',
          sound: 'default',
          click_action: 'Matikan Notifikasi',
        },
      },
    };

    // Kirim notifikasi ke semua token valid
    const response = await admin.messaging().sendMulticast({
      tokens: validTokens,
      ...payload,
    });

    if (response.failureCount > 0) {
      console.error('Some notifications failed to send:', response.responses);
    } else {
      console.log('Notifications sent successfully');
    }
  } catch (error) {
    console.error('Error sending notifications:', error);
    throw new Error('Failed to send notifications');
  }
};

module.exports = { sendNotificationService };
