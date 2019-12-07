<template>
  <main>
    Test
  </main>
</template>

<style scoped>
.icon {
  max-width: 100%;
}
</style>

<script>
import Vue from 'vue'

export default Vue.extend({
  asyncData() {
    return {
      date: Date.now(),
    }
  },
  mounted() {
    this.$accessor.testNuxtTyping()
    this.int = setInterval(() => {
      this.date = Date.now()
    }, 1000)
  },
  computed: {
    computedDate() {
      return new Date(this.date)
    },
  },
  beforeDestroy() {
    clearInterval(this.int)
  },
})
</script>
