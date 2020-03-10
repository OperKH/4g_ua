<template>
  <span v-if="diffQty[freq]" :class="{'text-success': diffQty[freq] > 0, 'text-danger': diffQty[freq] < 0}" :title="diffDate | formatDate"><template v-if="diffQty[freq] > 0">+</template>{{ diffQty[freq] }}</span>
</template>

<script>
export default {
  props: {
    diffDate: {
      type: String,
      required: false,
    },
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
