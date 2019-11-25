<template>
  <div class="hero is-medium">
    <div class="columns is-multiline is-2">
      <div class="column answers is-6-tablet "
           :class="[ shrink ? 'is-6-desktop' : 'is-4-desktop' ]"
           v-for="answer, index in filteredAnswers"
           v-if="(answer.player.userId !== player.userId)"
           >
        <!-- walk through all guesses -->
        <!-- can't select your own answer -->
        <div class="section">
          <guess :name="answer.player.name"
                 :text="answer.answer"
                 :isHotSeatPlayer="answer.player.userId === hotSeatPlayer.userId"
                 :revealed="revealAuthors"
                 :selectable="select && !inHotSeat"
                 :isSelected="selected === index"
                 :extraPoints="!!answer.extraPoints"
                 :correct="!!answer.correct"
                 @selected="handleSelection(index, answer)"
                 />
          <!-- let the host player adjudicate answers -->
          <div class="buttons is-centered" v-if="adjudicate">
            <button class="button"
                    :class="[ !!answer.correct ? 'is-success' : 'is-light is-outlined', !!answer.duplicate ? 'disabled' : '']"
                    :disabled="!!answer.duplicate"
                    @click="handleCorrect(answer)">
              <span class="icon">
                <i class="fa" :class="[ !!answer.correct ? 'fa-check-circle' : 'fa-circle-o']"></i>
              </span>
              <span>HotSeat Answer</span>
            </button>
            <button class="button"
                    :class="[ !!answer.duplicate ? 'is-warning' : 'is-light is-outlined', !!answer.correct ? 'disabled' : '']"
                    :disabled="!!answer.correct"
                    @click="handleDuplicate(answer)">
              <span class="icon">
                <i class="fa" :class="[ !!answer.duplicate ? 'fa-check-square-o' : 'fa-square-o']"></i>
              </span>
              <span>Duplicate Answer</span>
            </button>
            <button class="button"
                    :class="[ !!answer.extraPoints ? 'is-gold' : 'is-light is-outlined', (!!answer.correct || !!answer.duplicate) ? 'disabled' : '']"
                    :disabled="!!answer.correct || !!answer.duplicate"
                    @click="handleExtraPoints(answer)">
              <span class="icon">
                <i class="fa" :class="[ !!answer.extraPoints ? 'fa-star' : 'fa-star-o']"></i>
              </span>
              <span>Award Points</span>
            </button>
          </div>
          <!-- show tags for selection pics -->
          <div class="tags" v-show="revealPicks">
            <span class="tag is-info" v-for="pick in answer.picks">
              <span class="icon">
                <i class="fa fa-check"></i>
              </span>
              <span>{{pick.name}}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Guess from '@/components/Guess'

export default {

  name: 'answers',

  components: {
  	Guess,
  },

  props: [
    'shrink',
    'select',
    'revealAuthors',
    'revealPicks',
    'answers',
    'player',
    'adjudicate',
    'hotSeatPlayer',
    'inHotSeat'
  ],

  mounted(){
    this.selected = null
  },

  data () {
    return {
      selected: null,
    }
  },

  computed: {
    oddAnswers(){
      return (this.answers.length % 2)
    },
    filteredAnswers(){
      if(this.revealPicks || this.revealAuthors || this.select){
        let answers = this.answers.filter((answer) => (!!answer.duplicate) === false)
        let hostPicks = answers.filter((answer) => !!answer.correct)
        return hostPicks.length > 0 ? hostPicks : answers
      } else {
        return this.answers
      }
    }
  },
  
  methods: {
  	handleSelection(index, answer){
      if(this.selected !== index){
        this.selected = index;
        this.$emit('selected', answer)
      }
  	},
    handleDuplicate(answer){
      this.$emit('duplicate', answer)
    },
    handleCorrect(answer){
      this.$emit('correct', answer)
    },
    handleExtraPoints(answer){
      this.$emit('extraPoints', answer)
    }
  }
}
</script>

<style scoped lang="scss">
.column {
  /*flex-grow: 0;*/
  .section {
    padding: 1.5vw;
    width: 100%;
    .is-gold {
      background-color: #d4af37;
    }
  }
}
</style>
