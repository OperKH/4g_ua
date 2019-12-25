<template>
  <section>
    <h2>Сповіщення про нові базові станції</h2>
    <button type="button" @click="subscribeToNotifications">Підписатися</button>
  </section>
</template>

<script>
import firebase from '@/plugins/firebase'

export default {
  name: 'Settings',
  methods: {
    subscribeToNotifications() {
      const messaging = firebase.messaging()
      messaging.requestPermission()
        .then(() => messaging.getToken())
        .then(token => {
          this.$notify({
            title: 'Сповіщення',
            text: 'Ви успішно підписались на сповіщення про нові базові станції.',
            type: 'success',
            duration: 5000,
          })
          console.log(token)
        })
        .catch(e => {
          this.$notify({
            title: 'Сповіщення',
            text: 'Щось пішло не так.',
            type: 'error',
            duration: 6000,
          })
          console.log(e)
        })
    },
  },
}
</script>
