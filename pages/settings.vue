<template>
  <section>
    <h2>Сповіщення про нові базові станції</h2>
    <button class="btn btn-primary" type="button" @click="subscribeToNotifications" v-promise-btn>Підписатися</button>
    <button class="btn btn-warning" type="button" @click="unsubscribeToNotifications" v-promise-btn>Відписатися</button>
  </section>
</template>

<script>
import axios from 'axios'
import firebase from '@/plugins/firebase'

export default {
  name: 'Settings',
  methods: {
    subscribeToNotifications() {
      this.$ga.event('SubscribeNotifications', 'click', 'Subscribe to Notifications Btn Click')
      const messaging = firebase.messaging()
      return messaging
        .requestPermission()
        .then(() => messaging.getToken())
        .then(token => {
          console.log(token)
          return axios.post('/api/v2/subscription', { token, topic: 'bs' })
        })
        .then(() => {
          this.$notify({
            title: 'Сповіщення',
            text: 'Ви успішно підписались на сповіщення про нові базові станції.',
            type: 'success',
            duration: 5000,
          })
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
    async unsubscribeToNotifications() {
      this.$ga.event('UnsubscribeNotifications', 'click', 'Unsubscribe to Notifications Btn Click')
      const messaging = firebase.messaging()
      try {
        const token = await messaging.getToken()
        if (token) {
          console.log(token)
          await axios.delete('/api/v2/subscription', { params: { token, topic: 'bs' } })
          this.$notify({
            title: 'Сповіщення',
            text: 'Ви успішно відписались від сповіщень про нові базові станції.',
            type: 'success',
            duration: 7000,
          })
        } else {
          console.log('No token')
          this.$notify({
            title: 'Сповіщення',
            text: 'Ви не підписані.',
            type: 'цфктштл',
            duration: 5000,
          })
        }
      } catch (e) {
        this.$notify({
          title: 'Сповіщення',
          text: 'Щось пішло не так. Можливо ви не були підписані, або не давали згоду про сповіщення.',
          type: 'error',
          duration: 6000,
        })
        console.log(e)
      }
    },
  },
}
</script>

<style scoped>
h2 {
  margin-bottom: 10px;
}
.btn-warning {
  margin-left: 1.5em;
}
</style>
