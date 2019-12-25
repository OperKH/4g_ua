import firebase from 'firebase/app'
import 'firebase/messaging'

var firebaseConfig = {
  apiKey: 'AIzaSyBYllcTjoASGiHgrffMVCRKm8h4LDwG1Yc',
  projectId: 'push-4g',
  messagingSenderId: '114920397145',
  appId: '1:114920397145:web:c40451686015b7ecf91448',
}
// Initialize Firebase
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
}

export default firebase
