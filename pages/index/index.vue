<template>
<div>
  <h1>3g provinces</h1>
  <div class="content" v-if="provinces">
    <div><b>Київстар:</b>{{provinces.ks.total}}</div>
    <div><b>Vodafone:</b>{{provinces.mts.total}}</div>
    <div><b>Lifecell:</b>{{provinces.life.total}}</div>
    <div><b>3Mob:</b>{{provinces.triMob.total}}</div>
    <div><b>Оновлено:</b> {{provinces.updateDate}}</div>
  </div>
</div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'provinces-3g',
  data() {
    return {
      provinces: null,
      error: null,
    }
  },
  async asyncData(ctx) {
    const host = ctx.isServer ? 'http://localhost:3000' : ''
    try {
      const { data: provinces } = await axios.get(`${host}/api/3g-provinces.json`)
      return { provinces, error: null }
    } catch (error) {
      return { provinces: null, error }
    }
  },
}
</script>
