<template>
<div>
  <h1>3g cities</h1>
  <div class="content" v-if="cities">
    <div><b>Київстар:</b>{{cities.operators.ks.total}}</div>
    <div><b>Vodafone:</b>{{cities.operators.mts.total}}</div>
    <div><b>Lifecell:</b>{{cities.operators.life.total}}</div>
    <div><b>3Mob:</b>{{cities.operators.triMob.total}}</div>
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
  async asyncData() {
    const host = process.server ? 'http://localhost:3000' : ''
    try {
      const { data: cities } = await axios.get(`${host}/api/3g-cities.json`)
      return { cities, error: null }
    } catch (error) {
      return { cities: null, error }
    }
  },
}
</script>
