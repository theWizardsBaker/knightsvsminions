<template>
  <div class="hero is-medium">
    <div class="card-display">
      <div class="questions columns is-mobile is-centered">
        <div class="column is-narrow ">
          <card :display="reveal">
            <template #title>
              <slot name="title">
                <span v-if="question">{{question.hotSeatPlayer.name}}</span>
                <span v-else>{{cardQuestion.user}}</span>
              </slot>
            </template>
            <template #content>
              <div v-if="answer">
                <textarea class="textarea" placeholder="Hot Seat Question" v-model="cardQuestion.text">
                </textarea>
                <p class="help has-text-grey-light">{{characterCount}}/{{maxLength}}</p>
                <br/>
              </div>
              <div v-else>
                <span v-if="question">{{question.text}}</span>
                <span v-else>{{cardQuestion.text}}</span>
              </div>
            </template>
            <template #footer>
              <button class="button is-success is-fullwidth" 
                      v-if="answer"
                      @click="answerQuestion">
                Reveal
              </button>
            </template>
          </card>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Card from '@/components/Card'

export default {

  name: 'question',

  components: {
  	Card,
  },

  props: [
    'reveal',
    'answer',
    'question',
    'newRound'
  ],

  data () {
    return {
      maxLength: 255,
      cardQuestion: {
        user: "",
        text: "",
      },
    }
  },

  computed: {
    characterCount(){
      return this.cardQuestion.text.length
    }
  },

  watch: {
    characterCount: {
      immediate: true,
      deep: true,
      handler(value){
        if(value > this.maxLength){
          this.$set(this.cardQuestion, 'text', this.cardQuestion.text.substring(0, this.maxLength))
        }
      }
    }
  },

  methods: {
  	answerQuestion(){
      this.$emit('answered', this.cardQuestion)
      this.cardQuestion.user = ""
      this.cardQuestion.text = ""
  	}
  }
}
</script>

<style scoped lang="scss">

.card-display{
  padding-bottom: 25px;
  .questions {
    /*overflow: auto;*/
    overflow-x: auto;
    overflow-y: hidden;
    flex-direction: row-reverse;
    flex-wrap: nowrap;

    .help {
      text-align: right;
    }
  }
}
</style>
