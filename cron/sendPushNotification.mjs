import admin from 'firebase-admin'
import serviceAccount from '../serviceAccountKey.json'

export default function sendPushNotification(message) {
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  return admin
    .messaging()
    .send(message)
    .then(response => app.delete().then(() => response))
}
