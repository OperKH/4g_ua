<template>
<div>
  <ul>
    <li v-for="item in value" :key="item.name">{{item.label}}</li>
  </ul>
</div>
</template>

<script>
export default {
  props: ['value'],
}
</script>
