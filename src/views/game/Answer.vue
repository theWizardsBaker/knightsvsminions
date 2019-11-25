<template>
  <div class="hero is-medium">
    <div class="columns">
      <div class="column is-three-fifths is-offset-one-fifth">
        <guess :name="name"
               :revealed="true"
               :extraPoints="submittedAnswer.extraPoints"
               :correct="submittedAnswer.correct"
               >
          <template #text>
            <textarea class="textarea"
                      v-model="answer"
                      :disabled="lockedIn">
            </textarea>
            <p class="help has-text-grey-light">{{characterCount}}/{{length}}</p>
            <div class="actions">
              <div class="field is-grouped is-grouped-centered">
                <div class="control">
                  <button class="button"
                          :class="{ 'is-disabled is-light': lockedIn, 'is-success': !lockedIn }"
                          :disabled="lockedIn"
                          @click="lockAnswer"
                          >
                    <span  v-if="lockedIn">
                      <span class="icon">
                        <i class="fa fa-check" aria-hidden="true"></i>
                      </span>
                      <span>Submitted</span>
                    </span>
                    <span v-else>Submit Answer</span>
                  </button>
                </div>
              </div>
            </div>
          </template>
        </guess>
        <!-- show tags for selection pics -->
        <div class="tags" v-show="revealPicks">
          <span class="tag is-info" v-for="pick in picks">
            <span class="icon">
              <i class="fa fa-check"></i>
            </span>
            <span>{{pick.name}}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Guess from '@/components/Guess'

export default {
  
  name: 'answer',
  
  components: {
  	Guess,
  },

  props: [
    'name',
    'picks',
    'revealPicks',
    'submittedAnswer'
  ],

  mounted(){
    this.answer = ''
    this.lockedIn = false
  },

  data () {
    return {
      answer: '',
      length: 100,
      lockedIn: false
    }
  },

  computed: {
    characterCount(){
      return this.answer.length
    },
  },

  watch: {
    characterCount(value){
      if(value > this.length){
        this.$set(this, 'answer', this.answer.substring(0,this.length))
      }
    }
  },

  methods: {
    lockAnswer(){
      if(this.characterCount > 0 && answer.length !== "" && !this.lockedIn){
        this.lockedIn = true
        this.$emit('answer', this.answer)
      }
    },
    unlockAnswer(){

    }
  }
}
</script>

<style scoped lang="scss">
.hero {
  padding: 1.5vw;
  .help {
    text-align: right;
  }
  .actions {
    padding-bottom: 10px;
  }
}
</style>
