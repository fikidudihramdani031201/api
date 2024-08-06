const admin = require('firebase-admin');
const serviceAccount = require('../halogen-proxy-410816-250cfab65ff3.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotificationService = async (token, message) => {
  const payload = {
    notification: {
      title: 'Sriti',
      body: message,
    },
    android: {
      notification: {
        channel_id: 'my-channel',
        sound: 'default',
        click_action: 'Matikan Notifikasi'
      }
    },
    token: token,
  };

  try {
    await admin.messaging().send(payload);
    console.log('Notification sent successfully', payload);
  } catch (error) {
    console.error('Error sending notification:', error);
    throw new Error('Failed to send notification');
  }
};

module.exports = { sendNotificationService };
