<template>
  <div id="app">
  	<div class="hero is-dark" v-show="isLoading">
	  	<loading />
    </div>
    <router-view v-show="!isLoading" @toggleLoading="isLoading = !isLoading"/>
  </div>
</template>
<script>
import Loading from '@/components/Loading.vue'

export default {

  name: 'App',

  components: {
  	Loading,
  },

  data() {
  	return {
	  	isLoading: false
  	}
  }
}
</script

<style lang="scss" scoped>
#app {
  min-height: 100vh;
  .hero {

  }
}
</style>
