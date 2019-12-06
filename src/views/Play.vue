<template>
  <div class="gameboard hero is-dark">
    <!-- main navigation and options menu -->
    <navbar :name="player.name"
            :leader="isLeader"
            >
      <template #bar-end>
        <div class="buttons">
          <button class="button is-medium"
                  :class="{ 'is-light': popup.show, 'is-dark': !popup.show }"
                  @click="popup.show = true; popup.showMenu = true">
            <span class="icon">
              <i class="fa fa-gear" aria-hidden="true"></i>
            </span>
          </button>
<!--             <button class="button is-medium"
                  :class="{ 'is-light': display.playerlist, 'is-dark': !display.playerlist }" 
                  @click="display.playerlist = !display.playerlist">
            <span class="icon">
              <i class="fa fa-bars" aria-hidden="true"></i>
            </span>
          </button> -->
        </div>
      </template>
    </navbar>

    <!-- show the game actions -->
    <titlebar :title="currentStage.directions.title"
              :text="currentStage.directions.text"
              :showButton="(isLeader && !!currentStage.button)"
              :button="currentStage.button"
              :loading="display.loading"
              @continue="titlebarClick"
              />

    <!-- pop up helper -->
    <popup :display="popup.show" @close="popupClose">
      <!-- options menu -->
      <option-menu :options="game.options"
                   @optionClick="handleOptionClick"
                   v-if="popup.showMenu">
        <template #title>Options</template>
      </option-menu>
      <div class="section" v-else-if="popup.allegiance">
        <div class="is-centered has-text-centered container" 
             @mousedown="display.allegiance = true" 
             @mouseup="display.allegiance = false">
          <h3 class="title is-4 tag is-black">Press and Hold to Flip</h3>
          <div class="columns is-centered is-mobile">
            <div class="column is-narrow">
              <card :display="display.allegiance">
                <template #title>
                  <span class="tag is-medium is-knight fancy drop-shadow" v-if="allegiance">{{role.name}}</span>
                  <span class="tag is-medium is-minion fancy drop-shadow" v-else>{{role.name}}</span>
                </template>
                <template #content>
                  <p class="fancy" v-if="allegiance">
                    Loyal to the Round Table
                  </p>
                  <p class="fancy" v-else>
                    Disloyal to the Round Table
                  </p>
                  <div v-if="!allegiance || role.name === 'Merlin'">
                    <br/>
                    <div class="cohorts" v-if="role.name === 'Merlin'">Minions</div>
                    <div class="cohorts" v-else>cohorts</div>
                    <ul class="minion-list">
                      <li v-for="minion in minions">
                        <span class="fancy">{{minion.name}}</span>
                      </li>
                    </ul>
                  </div>
                </template>
              </card>
            </div>
          </div>
        </div>
      </div>
      <div class="section" v-else-if="popup.selectTeam">
        <article class="panel is-primary">
          <p class="panel-heading has-text-weight-bold has-text-centered">
            Select a Team
          </p>
          <a class="panel-block is-link"
             v-for="player in players"
             @click="selectPlayer(player)"
             :diabled="!teamSelection">
            <span class="panel-icon">
              <i class="fa"
                 aria-hidden="true"
                 :class="[ player.selected ? 'fa-check-square' : 'fa-square-o' ]"
                 >
              </i>
            </span>
            {{player.name}}
          </a>
          <a class="panel-block">
            <button class="button is-fullwidth" :class="{ 'is-success': teamSelection }" :disabled="!teamSelection">
              Select Team
            </button>
          </a>
        </article>
      </div>
      <div class="section" v-else-if="popup.vote">
        <h3 class="title">
          {{leader.name}}
        </h3>
        <h3 class="subtitle">
          Mission {{game.round + 1}}
        </h3>
        <player-list :players="questi"/>
      </div>
    </popup>


    <div class="game">
      <div class="game-display">
        <div class="columns">
          <div class="column" >
            <steps :leader="leader"
                   :teams="teamSize"
                   @selectTeam="selectTeam"
                   />
            <votes />
          </div>
          <!-- scoreboards -->
          <transition name="slide-right">
            <div class="column is-5-desktop is-6-tablet is-hidden-mobile is-hidden-touch playerlist"
                 v-show="display.playerlist">
              <player-list :players="players" />
            </div>
          </transition>
          <transition name="slide-right">
            <div class="is-hidden-desktop floating-playerlist playerlist" v-show="display.playerlist">
              <player-list :players="players"/>
            </div>
          </transition>
        </div>
      </div>
    </div>


  </div>
</template>

<script>
import Popup from '@/components/Popup'
import Navbar from '@/components/Navbar'
import Titlebar from '@/components/Titlebar'
import OptionMenu from '@/components/OptionMenu'
import ConfirmBox from '@/components/ConfirmBox'
import Steps from '@/components/Steps'
import Votes from '@/components/Votes'
import PlayerList from '@/components/PlayerList'
import Card from '@/components/Card'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  name: 'Play',

  components: {
    Card,
  	Navbar,
    Popup,
    Titlebar,
    OptionMenu,
    ConfirmBox,
    Steps,
    PlayerList,
    Votes,
  },

  created(){

    window.addEventListener('beforeunload', this.leaving)

    // reset everything
    this.game.round = 0
    this.display.endgame = false
    this.display.loading = false

  },

  data () {
    return {

      display: {
        endgame: false,
        loading: false,
        allegiance: false
      },

      popup: {
        show: true,
        showMenu: false,
        allegiance: true
      },

      game: {

        round: 0,

        stage: 0,

        quests: [],

        questTeamSize: [
          [2,3,2,3,3], //5 players
          [2,3,4,3,4], //6
          [2,3,3,4,4], //7
          [3,4,4,5,5], //8
          [3,4,4,5,5], //9
          [3,4,4,5,5], //10
          [4,5,5,6,6], //11
          [4,5,5,6,6], //12
        ],

        stages: [
          {
            name: 'selectTeam',
            directions: {
              title: "Select",
              text: "The Leader selects a team"
            },
            display: {

            },
          },
          {
            name: 'vote',
            directions: {
              title: "Vote",
              text: "Approve or Reject the Leader's team"
            },
            display: {

            },
          },
          {
            name: 'quest',
            directions: {
              title: "Read",
              text: "The player in the Hot Seat reads all of the answers out loud",
              hotseat: "Mark matching or duplicate answers"
            },
            display: {

            },
            button: {
              text: 'Continue',
              action: 'finishAdjudicate'
            }
          },
          {
            name: 'reveal',
            directions: {
              title: "Guess",
              text: "Select which answer you think was written by the player in the Hot Seat",
            },
            display: {

            },
          },
          {
            name: 'score',
            directions: {
              title: "Score",
              text: "Recieve points for your answer"
            },
            display: {

            }
          }
        ],

        options: [
          {
            text: 'Game Rules',
            icon: 'fa-book',
            action: 'scoring',
          },
          {
            text: 'Check Allegiance',
            icon: 'fa-user',
            action: 'allegiance',
          }
        ],

      }
    }
  },

  watch: {

    currentStage(){
      this.setDisplay()
    },

    connected: {
      immediate: true,
      handler(val){
        if(!val){
          this.$router.replace({ path: '/' })
        }
      }
    },

    'game.stage': {
      immediate: true,
      handler(val){
        if(val === 0){
          // this.startRound()
          this.checkEndGame()
        }
      }
    },

  },

  computed: {

    // get the states from the store
    ...mapState({
      minPlayers: ({game})=> game.minPlayers,
      maxPlayers: ({game})=> game.maxPlayers,
    }),

    ...mapGetters([
      'isHost',
      'player',
      'leader',
      'gameKey',
      'players',
      'isLeader',
      'connected',
      'allegiance',
      'role',
      'quest'
    ]),

    playerInfo(){
      if(!!this.player){
        return {
          name: this.player.name,
          userId: this.player.userId
        }
      }
    },

    currentStage(){
      return this.game.stages[this.game.stage]
    },

    minions() {
      return this.players.filter(player => !player.role.alignment)
    },

    knights() {
      return this.players.filter(player => player.role.alignment)
    },

    teamSize() {
      return this.game.questTeamSize[this.players.length - this.minPlayers]
    },

    teamSelection(){
      return this.teamSize[this.game.round] === this.players.filter(player => player.selected).length
    }

  },

  sockets: {

  },

  methods: {

    ...mapActions([
      'incrementRound',
      'endGame'
    ]),

    // setDisplay(){
    //   if(this.player.active || this.player.spectator){
    //     // set loading to false every time
    //     this.display.loading = false
    //     // hide all display elements
    //     for (const [key, value] of Object.entries(this.currentStage.display)) {
    //       this.display[key] = value
    //     }
    //   }
    // },

    selectTeam() {
      this.popup.show = true
      this.popup.selectTeam = true
    },

    selectPlayer(player) {
      if(!this.teamSelection || player.selected){
        this.$store.dispatch('playerSelect', player.userId)
      }
    },

    sendSelections(){
      // data: {
        // leader: user,
        // team: [],
      // }
      // emit to socket
      this.$socket.client.emit('submit_team', data)
    },

    leaving(){
      this.quitGame()
    },

    startRound(){
      if(this.players.length > 1 && this.isLeader){
        this.delay(800).then(() => {
          this.display.revealQuestion = true
          this.display.answerQuestion = true
        })
      }
    },

    titlebarClick(){
      this.display.loading = true
      this[this.currentStage.button.action]()
    },

    checkEndGame(){
      return false
    },

    finishAdjudicate(){
      let correct = []
      let duplicates = []
      let extraPoints = null

      this.currentQuestion.answers.forEach((answer) => {
        if(!!answer.correct){
          correct.push(answer.player.userId)
        }
        if(!!answer.duplicate){
          duplicates.push(answer.player.userId)
        }
        if(!!answer.extraPoints){
          extraPoints = answer.player.userId
        }
      })
      // find a correct answer -- if there is one
      this.$socket.client.emit('adjudicate_answers', {
        gameKey: this.gameKey,
        correct: correct,
        duplicates: duplicates,
        extraPoints: extraPoints
      })
    },

    extraPoints(answer){
      let extraPoints = !!answer.extraPoints
      // remove all
      this.removeExtraPoints()
      // set
      this.$set(answer, 'extraPoints', !extraPoints)
    },

    submitSelectedAnswer(answer){
      this.$socket.client.emit('select_answer', {
        gameKey: this.gameKey,
        answer: answer,
        player: this.playerInfo
      })
    },

    advanceStage(increment = 1){
      let len = this.game.stages.length
      if(this.game.stage === len - 1){
        if(this.isHost){
          this.$socket.client.emit('advance_round', { gameKey: this.gameKey })
        }
        this.game.stage = 0
      } else {
        this.incrementStage(increment)
        this.game.stage += increment
      }
    },

    popupClose(){
      this.popup.show = false
      this.popup.showMenu = false
      this.popup.playerScore = false
      this.popup.allegiance = false
      this.popup.selectTeam = false
    },

    handleOptionClick(action){
      // set point maximum
      switch(action){
        case 'allegiance':
          this.popup.showMenu = false
          this.popup.allegiance = true
        break;
      }

    },

  }
}
</script>

<style scoped lang="scss">

  @import "@/styles/slide-right-animation.scss";

  .slide-right-enter-active {
    animation: slideInRight .5s;
  }
  .slide-right-leave-active {
    animation: slideOutRight .4s reverse;
  }

  .panel-block {
    background-color: white;
    th {
      white-space: nowrap;
    }
  }

  .score {
    .subtitle {
      font-variant: small-caps;
      margin-bottom: 1.5em;
      padding-bottom: .5em;
      border-bottom: 1px solid grey;
    }
    .points{
      background-color: #363636;
      color: whitesmoke;
      padding: 10px;
      width: 15em;
      border-radius: 6px;
      margin: auto;

      .plus {
        margin-bottom: 15px;
        margin-right: 3px;
        display: inline-block;
        font-size: .7em;
        vertical-align:middle;
      }

      .pts {
        font-size: .5em;
        padding-left: 5px;
      }
    }
  }

  .cohorts {
    font-variant: small-caps;
    font-weight: bold;
    padding-bottom: 5px;
  }

  .minion-list {
    font-weight: bold;
    font-color: black;
    font-size: 1.2em;
  }

  .gameboard {
    /*min-width: 100vw;*/
    position: relative;
    padding: 0;
    display: flex;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;

    .game {

      padding: 0 4em;
      flex: 1;
      display: flex;
      justify-content: center;
      flex-direction: column;

      .game-display {

        .section {
          padding: 2em;
          padding-bottom: 5em;
          &:first-child {
            padding-bottom: 4em;
          }
        }

        .button{
          &.is-centered {
            margin: auto;
          }
        }

        .columns {
          position: relative;

          .playerlist {
            padding: 4em;
          }

          .floating-playerlist {
            z-index: 205;
            background-color: #00000045;
            position: absolute;
            height: 100%;
            min-height: 100vh;
            width: 100%;
            top: 10px;
            left: 0;
          }
        }
      }
    }
  }



</style>
