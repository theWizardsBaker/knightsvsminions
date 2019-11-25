<template>
  <div class="hero is-medium">
    <div class="questions columns is-mobile">
      <div class="column is-narrow old-questions" v-for="question in questions">
        <card :display="true">
          <template #title>
            {{question.user}}
          </template>
          <template #content>
            {{question.text}}
          </template>
          <template #footer>
          </template>
        </card>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {
  
  name: 'questions',
  
  components: {
  	Card,
  },

  props: ['questions'],

  data () {
    return {
    }
  },
  
  methods: {
  	handleSelection(option){

  	}
  }
}
</script>

<style scoped lang="scss">
.hero {

  padding: 0 4vw;
  .questions {
    overflow-x: auto;
    overflow-y: hidden;
    /*flex-direction: row-reverse;*/
    width: 87vw;
    /*justify-content: center;*/
  }
}
</style>
