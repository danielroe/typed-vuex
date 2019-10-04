<template>
  <div class="container">
    <nuxt />

    <footer>Generated on {{ date }}</footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      date: new Date()
    };
  }
};
</script>