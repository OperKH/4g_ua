<template>
<div>
  <nav>
    <ul class="nav-list">
      <li>
        <router-link to="/">3G БС за областями</router-link>
      </li>
      <li>
        <router-link to="/3g-cities">3G БС за містами</router-link>
      </li>
    </ul>
  </nav>
  <nuxt-child />
</div>
</template>

<script>
export default {
  name: 'index',
}
</script>

<style scoped>
.nav-list {
  display: flex;
}
.nav-list li + li {
  margin-left: 15px;
}
</style>
