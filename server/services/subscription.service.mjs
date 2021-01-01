import fs from 'fs'
import path from 'path'
import admin from 'firebase-admin'

const serviceAccountPath = path.join('', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath))

export default class subscriptionService {
  static async subscribe(token, topic) {
    const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    const res = await admin.messaging().subscribeToTopic(token, topic)
    await app.delete()
    return res
  }
  static async unsubscribe(token, topic) {
    const app = admin.initializeApp({ credential: admin.credential.cert(serviceAccount) })
    const res = await admin.messaging().unsubscribeFromTopic(token, topic)
    await app.delete()
    return res
  }
}
