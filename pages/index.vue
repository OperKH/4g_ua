<template>
<div>
  <nav>
    <ul>
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

