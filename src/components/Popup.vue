<template>
  <div class="modal" :class="{ 'is-active': display }">
    <div class="modal-background" @click="emitClose"></div>
    <div class="modal-card">
      <section>
        <slot></slot>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="emitClose"></button>
  </div>

</template>

<script>
export default {

  name: 'popup',

  props: {
    display:{
      type: Boolean,
      default: false
    }
  },

  data () {
    return {

    }
  },

  methods: {
    emitClose(){
      this.$emit('close')
    }
  }

}
</script>

<style scoped lang="scss">

</style>