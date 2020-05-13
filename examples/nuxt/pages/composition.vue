<template>
  <div :class="$style.test">
    <slot />
  </div>
</template>

<script lang="ts">
import { createComponent, computed } from "@vue/composition-api";

export default createComponent({
  setup(_props, { root }) {
    const email = computed(() => root.$accessor.email);
    const setEmail = () => {
      root.$accessor.setEmail("test@email.com");
    };

    return {
      email,
      setEmail
    };
  }
});
</script>

<style lang="postcss" module>
.test {
}
</style>
