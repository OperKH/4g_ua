/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import fs from 'fs'
import path from 'path'
import { initializeApp, deleteApp, cert } from 'firebase-admin/app'
import { getMessaging } from 'firebase-admin/messaging'

const serviceAccountPath = path.join('', 'serviceAccountKey.json')
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath))

export default class subscriptionService {
  static async subscribe(token, topic) {
    const app = initializeApp({ credential: cert(serviceAccount) })
    const res = await getMessaging().subscribeToTopic(token, topic)
    await deleteApp(app)
    return res
  }

  static async unsubscribe(token, topic) {
    const app = initializeApp({ credential: cert(serviceAccount) })
    const res = await getMessaging().unsubscribeFromTopic(token, topic)
    await deleteApp(app)
    return res
  }
}
