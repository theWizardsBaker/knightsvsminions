<template>
  <div>
    <h3 class="title is-3 fancy-title has-text-centered">
      Quest Result
    </h3>
    <br/>
    <div class="columns is-multiline is-centered is-mobile">
      <div class="column is-narrow" v-for="result, index in results">
        <card :display="result.reveal">
            <template #title>
              <span class="tag is-medium fancy drop-shadow"
                    :class="[ result.success ? 'is-success' : 'is-danger' ]">
                {{ result.success ? 'Success' : 'Fail' }}
              </span>
            </template>
            <template #content>
              <div>
                <img class="image" :src="images[result.success]" />
              </div>
            </template>
          </card>
      </div>
    </div>
    <br/>
    <div class="has-text-centered">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {

  name: 'QuestResult',

  components: {
    Card
  },

  props: {
    results: {
      type: Array,
      default: () => []
    },
  },

  data() {
    return {
      images: {
        true: require('@/assets/grail-cup-success.png'),
        false: require('@/assets/grail-cup-fail.png'),
      },
    }
  },

}
</script>

<style scoped lang="scss">

</style>
