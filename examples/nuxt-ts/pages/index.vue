<template>
  <div class="container">
    <div>
      <logo />
      <h1 class="title">
        nuxt-typed-vuex-example
      </h1>
      <h2 class="subtitle">
        Example project for nuxt-typed-vuex.
      </h2>
      <div class="row">Email: {{ email }}</div>
      <div class="row"><button @click="setEmail">Set email</button></div>
      <div class="links">
        <a
          href="https://nuxt-typed-vuex.danielcroe.com/"
          target="_blank"
          class="button--green"
        >
          Documentation
        </a>
        <a
          href="https://github.com/danielroe/nuxt-typed-vuex"
          target="_blank"
          class="button--grey"
        >
          GitHub
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from "vue-property-decorator";
import Logo from "~/components/Logo.vue";

@Component({
  components: {
    Logo
  }
})
export default class HomePage extends Vue {
  get email() {
    return this.$accessor.email;
  }

  setEmail() {
    this.$accessor.setEmail("test@email.com");
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont,
    "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
