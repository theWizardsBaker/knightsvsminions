<template>
  <div class="hero is-medium">
    <div class="columns is-multiline is-2">
      <div class="column answers is-6-tablet "
           :class="[ shrink ? 'is-6-desktop' : 'is-4-desktop' ]"
           v-for="gamePlayer in playerAnswers"
           v-if="gamePlayer.userId !== player.userId"
           >
        <div class="section">
          <div class="box" v-if="gamePlayer.answer">
            <h3 class="subtitle has-text-black has-text-centered player-name">
              <h3 class="subtitle has-text-centered has-text-black">{{gamePlayer.name}}</h3>
              <span class="tag is-white">
                <i class="fa fa-check fa-4x" aria-hidden="true"></i>
              </span>
            </h3>
          </div>
          <div class="placeholder" v-else>
            <h3 class="subtitle has-text-centered player-name">
              {{gamePlayer.name}}
            </h3>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Guess from '@/components/Guess'

export default {
  
  name: 'answers-completed',
  
  components: {
  	Guess,
  },

  props: [
    'shrink',
    'answers',
    'players',
    'player'
  ],

  data () {
    return {
      playerAnswers: []
    }
  },

  watch: {
    answers: {
      immediate: true,
      handler(val){
        this.buildPlayerAnswers()
      }
    },
    players: {
      immediate: true,
      handler(val){
        this.buildPlayerAnswers()
      }
    }
  },

  computed: {
    oddAnswers(){
      return (this.answers.length % 2)
    }
  },


  methods: {
  	buildPlayerAnswers(){
      let playerAnswers = []
      for(let i = 0; i < this.players.length; i++){
        let player = Object.assign({}, this.players[i])
        for(let j = 0; j < this.answers.length; j++){
          if(this.answers[j].player.userId === player.userId){
            player['answer'] = this.answers[j]
          }
        }
        playerAnswers.push(player)
      }
      this.playerAnswers = playerAnswers
  	},
  }
}
</script>

<style scoped lang="scss">
.column {
  /*flex-grow: 0;*/
  .section {
    padding: 1.5vw;
    width: 100%;

    .box {
      min-height: 130px;
      padding-top: 25px;
    }

    .placeholder {
      border: 3px dashed lightgrey;
      border-radius: 8px;
      padding: 8px;
      min-height: 130px;
      .player-name {
        padding-top: 40px;
      }
    }
  }
}
</style>
