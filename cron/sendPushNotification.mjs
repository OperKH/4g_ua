import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

const serviceAccountPath = path.join('', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath))

export default function sendPushNotification(message) {
  const app = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  })

  return admin
    .messaging()
    .send(message)
    .then(response => app.delete().then(() => response))
}
