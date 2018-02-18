<template>
<div>
  <h1>3g cities</h1>
  <div class="content" v-if="cities">
    <div><b>Київстар:</b>{{cities.ks.total}}</div>
    <div><b>Vodafone:</b>{{cities.mts.total}}</div>
    <div><b>Lifecell:</b>{{cities.life.total}}</div>
    <div><b>3Mob:</b>{{cities.triMob.total}}</div>
    <div><b>Оновлено:</b> {{cities.updateDate}}</div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'cities-3g',
  data() {
    return {
      cities: null,
      error: null,
    }
  },
  async asyncData(ctx) {
    const host = ctx.isServer ? 'http://localhost:3000' : ''
    try {
      const { data: cities } = await axios.get(`${host}/api/3g-cities.json`)
      return { cities, error: null }
    } catch (error) {
      return { cities: null, error }
    }
  },
}
</script>
