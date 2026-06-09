import { Router, Request, Response } from 'express';
import * as admin from 'firebase-admin';

// Initialize Firebase Admin using the secure key we downloaded
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const router = Router();

router.post('/send-notification', async (req: Request, res: Response): Promise<void> => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    res.status(400).json({ error: 'Missing fcmToken, title, or body' });
    return;
  }

  try {
    const message = {
      notification: { title, body },
      token: fcmToken
    };

    // Fire the push notification to Firebase
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to send notification', details: error.message });
  }
});

export default router;