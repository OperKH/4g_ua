<template>
  <div>
    <nav>
      <ul class="nav-list">
        <li v-for="nav in navigation" :key="nav.to">
          <router-link class="nav-link" :to="nav.to">{{ nav.name }}</router-link>
        </li>
      </ul>
    </nav>
    <nuxt />
    <notifications />
  </div>
</template>

<script>
import { getMessaging, onMessage } from 'firebase/messaging'
import firebaseApp from '@/plugins/firebase'

export default {
  name: 'Index',
  data() {
    return {
      navigation: [
        {
          name: '4G по областях',
          to: '/',
        },
        {
          name: '4G по містах',
          to: '/4g-cities',
        },
        {
          name: '3G по областях',
          to: '/3g-provinces',
        },
        {
          name: '3G по містах',
          to: '/3g-cities',
        },
        {
          name: 'Налаштування',
          to: '/settings',
        },
      ],
    }
  },
  methods: {
    initNotification() {
      const messaging = getMessaging(firebaseApp)
      onMessage(messaging, payload => {
        const { title, body } = payload.notification
        this.$notify({
          title,
          text: body,
          type: 'success',
          duration: 15000,
        })
      })
    },
  },
  mounted() {
    this.initNotification()
  },
}
</script>

<style scoped>
@import '@/assets/styles/general/root.css';

.nav-list {
  display: flex;
  font-size: 1.5rem;
  line-height: 2rem;
  margin: 0 -0.75rem;
}
.nav-list li {
  padding: 0 0.75rem;
}
.nav-list li:nth-child(5) {
  margin-left: auto;
}
.nav-link {
  display: inline-block;
  padding-top: 10px;
  padding-bottom: 15px;
  color: var(--gray);
}
.nav-link:hover {
  color: var(--primary);
}
.nav-link.nuxt-link-exact-active {
  font-weight: bold;
  color: var(--success);
  cursor: auto;
}

@media (max-width: 767px) {
  .nav-list {
    flex-wrap: wrap;
    margin: 0 -0.25rem;
  }
  .nav-list li {
    flex-basis: 25%;
    max-width: 25%;
    text-align: center;
    padding: 0 0.25rem;
  }
  .nav-list li:nth-child(5) {
    flex-basis: 50%;
    max-width: 50%;
    margin-left: 50%;
    order: -1;
  }
  .nav-list li:nth-child(5) .nav-link {
    padding-bottom: 10px;
    width: 100%;
  }
}

@media (max-width: 424px) {
  .nav-list {
    font-size: 1.2rem;
    line-height: 1.5rem;
  }
}

@media (max-width: 374px) {
  .nav-list {
    font-size: 1.1rem;
    line-height: 1.3rem;
  }
}
</style>
