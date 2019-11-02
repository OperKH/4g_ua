<template>
  <span v-if="diffQty[freq]" :class="{'text-success': diffQty[freq] > 0, 'text-danger': diffQty[freq] < 0}"><template v-if="diffQty[freq] > 0">+</template>{{ diffQty[freq] }}</span>
</template>

<script>
export default {
  props: {
    diffQty: {
      type: Object,
      required: true,
    },
    freq: {
      type: [String, Number],
      required: true,
    },
  },
}
</script>
