/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import fs from 'fs'
import path from 'path'
import { initializeApp, deleteApp, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

const serviceAccountPath = path.join('', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath))

export default function sendPushNotification(message) {
  const app = initializeApp({
    credential: cert(serviceAccount),
  })

  return getMessaging()
    .send(message)
    .then(response => deleteApp(app).then(() => response))
}
