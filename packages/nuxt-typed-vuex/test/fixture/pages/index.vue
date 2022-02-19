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
import { mapper } from '~/store'

export default Vue.extend({
  asyncData() {
    return {
      date: Date.now(),
    }
  },
  mounted() {
    this.$accessor.nuxt.testNuxtTyping()
    this.int = setInterval(() => {
      this.date = Date.now()
    }, 1000)
    this.setEmail('my@test.com')
    console.log(this.fullEmail)
    this.setFirstName('John')
  },
  computed: {
    ...mapper('fullEmail'),
    computedDate() {
      return new Date(this.date)
    },
  },
  methods: {
    ...mapper(['setEmail']),
    ...mapper('submodule', ['setFirstName']),
  },
  beforeDestroy() {
    clearInterval(this.int)
  },
})
</script>
