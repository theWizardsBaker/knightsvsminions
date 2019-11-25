<template>
  <div class="box has-text-centered" >
    <h3 class="title is-5 has-text-dark">
      <slot></slot>
    </h3>
    <div class="field is-grouped is-grouped-centered">
      <div class="control">
        <button class="button is-link"
                @click="emit('confirm')">
          Confirm
        </button>
      </div>
      <div class="control">
        <button class="button is-primary" 
                @click="emit('cancel')">
          Cancel
        </button>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  
  name: 'confirm',

  data () {
    return {

    }
  },
  
  methods: {
    emit(action){
      this.$emit(action)
    }
  }
}
</script>

<style scoped lang="scss">

</style>
