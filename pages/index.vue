<template>
<div>
  <nav>
    <ul class="nav-list">
      <li v-for="nav in navigation" :key="nav.to">
        <router-link class="nav-link" :to="nav.to">{{ nav.name }}</router-link>
      </li>
    </ul>
  </nav>
  <nuxt-child />
</div>
</template>

<script>
export default {
  name: 'index',
  data() {
    return {
      navigation: [
        {
          name: '3G по областях',
          to: '/',
        },
        {
          name: '3G по містах',
          to: '/3g-cities',
        },
      ],
    }
  },
}
</script>

<style scoped>
@import '@/assets/styles/general/root.css';

.nav-list {
  display: flex;
  font-size: 1.5rem;
}
.nav-list li + li {
  margin-left: 15px;
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
</style>
