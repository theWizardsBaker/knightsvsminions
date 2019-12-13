<template>
  <div class="modal" :class="{ 'is-active': display }">
    <div class="modal-background" @click="emitClose"></div>
    <div class="modal-card">
      <section>
        <slot></slot>
      </section>
    </div>
    <button class="modal-close is-large" aria-label="close" @click="emitClose" v-if="closeable"></button>
  </div>

</template>

<script>
export default {

  name: 'popup',

  props: {
    display:{
      type: Boolean,
      default: false
    },
    closeable: {
      type: Boolean,
      default: true
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
.modal-card {
  padding: 20px;
}
</style>