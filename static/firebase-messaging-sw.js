import { initializeApp } from 'firebase/app'
import { getMessaging } from 'firebase/messaging/sw'

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: 'AIzaSyBYllcTjoASGiHgrffMVCRKm8h4LDwG1Yc',
  projectId: 'push-4g',
  messagingSenderId: '114920397145',
  appId: '1:114920397145:web:c40451686015b7ecf91448',
})

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = getMessaging(firebaseApp)
