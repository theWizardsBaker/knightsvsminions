<template>
  <div class="gameboard hero is-dark">
    <div v-if="loaded">
      <!-- main navigation and options menu -->
      <navbar :name="player.name"
              :inHotSeat="$store.getters.inHotSeat"
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
            <button class="button is-medium"
                    :class="{ 'is-light': display.playerlist, 'is-dark': !display.playerlist }" 
                    @click="display.playerlist = !display.playerlist">
              <span class="icon">
                <i class="fa fa-bars" aria-hidden="true"></i>
              </span>
            </button>
          </div>
        </template>
      </navbar>

      <div class="game container">
        <div class="game-display">
          <div class="columns">
            <div class="column" >
<!--               <br/>
              <nav class="level">
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Leader</p>
                    <p class="title is-2">Justin</p>
                  </div>
                </div>
                <div class="level-item has-text-centered">
                  <div>
                    <p class="heading">Quest</p>
                    <p class="title is-2">1</p>
                  </div>
                </div>
              </nav> -->
              <steps />
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
  </div>
</template>

<script>
import Popup from '@/components/Popup'
import Navbar from '@/components/Navbar'
import Titlebar from '@/components/Titlebar'
import Questions from '@/views/game/Questions'
import Question from '@/views/game/Question'
import AnswersCompleted from '@/views/game/AnswersCompleted'
import Answers from '@/views/game/Answers'
import Answer from '@/views/game/Answer'
import PlayerOrder from '@/views/game/PlayerOrder'
import OptionMenu from '@/components/OptionMenu'
import ConfirmBox from '@/components/ConfirmBox'
import Steps from '@/components/Steps'
import Votes from '@/components/Votes'
import PlayerList from '@/components/PlayerList'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  name: 'Play',

  components: {
  	Navbar,
    Popup,
    Titlebar,
    Questions,
    Question,
    Answer,
    Answers,
    AnswersCompleted,
    OptionMenu,
    PlayerOrder,
    ConfirmBox,
    Steps,
    PlayerList,
    Votes,
  },

  created(){

    window.addEventListener('beforeunload', this.leaving)

    // reset everything
    this.game.round = 0
    this.game.stage = 0

    this.display.playerlist = false
    this.display.hideQuestion = false
    this.display.questionHistory = false
    this.display.answerQuestion = false
    this.display.revealQuestion = false
    this.display.answer = false
    this.display.answers = false
    this.display.adjudicateAnswers = false
    this.display.selectAnswers = false
    this.display.revealAuthors = false
    this.display.score = false
    this.display.endgame = false
    this.display.loading = false


    if(this.isHost){
      // if we're the host, just load
      this.loaded = true
    } else {
      // if we're the client, ask the host what the state is
      this.$socket.client.emit('request_game_state', { gameKey: this.gameKey })
      this.setDisplay()
    }

  },

  data () {
    return {

      loaded: false,

      display: {
        playerlist: false,
        hideQuestion: false,
        questionHistory: false,

        answerQuestion: false,
        revealQuestion: false,

        answer: false,
        answers: false,

        adjudicateAnswers: false,
        selectAnswers: false,
        revealAuthors: false,

        score: false,
        endgame: false,
        correctAnswer: false,
        loading: false
      },

      popup: {
        show: false,
        scoring: false,
        showMenu: false,
        confirmQuit: false,
        reorderPlayers: false,
        playerScore: false,
      },

      game: {

        endGameScore: 10,

        round: 0,

        stage: 0,

        stages: [
          {
            name: 'enterHotSeat',
            directions: {
              title: "Draw",
              text: "Player in the Hot Seat selects and reads a card"
            },
            display: {
              correctAnswer: false,
              revealQuestion: false,
              answerQuestion: false,
              answer: false,
              revealPicks: false,
              revealAuthors: false,
              score: false,
            },
            scrollTo: 'question'
          },
          {
            name: 'answerQuestion',
            directions: {
              title: "Answer",
              text: "Write an answer to the Hot Seat card from the perspective of the player in the Hot Seat"
            },
            display: {
              revealQuestion: true,
              answerQuestion: false,
              answer: true,
              answers: true
            },
            scrollTo: 'answer'
          },
          {
            name: 'read',
            directions: {
              title: "Read",
              text: "The player in the Hot Seat reads all of the answers out loud",
              hotseat: "Mark matching or duplicate answers"
            },
            display: {
              revealQuestion: true,
              answers: false,
              adjudicateAnswers: true,
            },
            button: {
              text: 'Continue',
              action: 'finishAdjudicate'
            }
          },
          {
            name: 'vote',
            directions: {
              title: "Guess",
              text: "Select which answer you think was written by the player in the Hot Seat",
            },
            display: {
              revealQuestion: true,
              answers: false,
              selectAnswers: true,
              adjudicateAnswers: false,
            },
          },
          {
            name: 'revealPicks',
            directions: {
              title: "Reveal Picks",
              text: "Selections for each answer are revealed"
            },
            display: {
              revealQuestion: true,
              answers: false,
              adjudicateAnswers: false,
              revealPicks: true,
              selectAnswers: false
            },
            button: {
              text: "Reveal Authors",
              action: 'revealAuthors'
            }
          },
          {
            name: 'revealAuthors',
            directions: {
              title: "Reveal",
              text: "The player in the Hot Seat's answer is revealed"
            },
            display: {
              revealQuestion: true,
              answers: false,
              selectAnswers: false,
              adjudicateAnswers: false,
              revealPicks: true,
              revealAuthors: true,
              selectAnswers: false
            },
            button: {
              text: "Score Answers",
              action: 'scoreAnswers'
            }
          },
          {
            name: 'score',
            directions: {
              title: "Score",
              text: "Recieve points for your answer"
            },
            display: {
              revealQuestion: true,
              score: true,
              revealPicks: true,
              revealAuthors: true,
              answerQuestion: false
            }
          }
        ],

        options: [
          {
            text: 'Toggle Question Display',
            icon: 'fa-eye-slash',
            action: 'hide-questions',
            hotseat: false,
          },
          {
            text: 'Select Player Order',
            icon: 'fa-users',
            action: 'reorder',
            hotseat: true,
          },
          {
            text: 'Scoring Points',
            icon: 'fa-sort-numeric-asc',
            action: 'scoring',
            hotseat: false,
          },
          {
            text: 'Quit Game',
            icon: 'fa-times-circle',
            action: 'quit',
            hotseat: false
          }
        ],

      }
    }
  },

  watch: {

    currentStage(){
      this.setDisplay()
    },

    loaded: {
      immediate: true,
      handler(val){
        // if(!val){
          this.$emit('toggleLoading')
        // }
      }
    },

    connected: {
      immediate: true,
      handler(val){
        if(!val){
          this.$router.replace({ path: '/' })
        }
      }
    },

    players(){
      if(this.game.stage <= 1){
        this.activatePlayers()
      }
      if(this.game.round === 0 && this.game.stage === 0){
        this.startRound()
      }
    },

    inHotSeat: {
      immediate: true,
      handler(){
        this.startRound()
      }
    },

    'game.stage': {
      immediate: true,
      handler(val){
        if(val <= 1){
          this.activatePlayers()
        }
        if(val === 0){
          // this.startRound()
          this.checkEndGame()
        }
      }
    },

    answersRemaining(val){
      if(val === 0){
        this.advanceStage()
      }
    },

    // answerPicksRemaining(val){
    //   if(val === 0 && this.currentStage.name === 'vote'){
    //     this.advanceStage()
    //   }
    // },

    synced: {
      immediate: true,
      handler(val, val2){
        if(!this.loaded && val){
          this.loaded = val
        }
      }
    },

    'display.score'(val){
      if(val && !this.player.spectator){
        this.popup.playerScore = true
        this.popup.show = true
      }
    },

  },

  computed: {
    // get the states from the store
    ...mapState({
      user: ({user}) => user,
      connected: ({game}) => game.connected,
      questions: ({questions}) => questions,
    }),

    ...mapGetters({
      synced: 'synced',
      isHost: 'isHost',
      player: 'player',
      answers: 'answers',
      gameKey: 'gameKey',
      inHotSeat: 'inHotSeat',
      players: 'players',
      gameWinner: 'gameWinner',
      hotSeatPlayer: 'hotSeatPlayer',
      currentQuestion: 'currentQuestion',
      answersRemaining: 'answersRemaining',
    }),

    answer(){
      let answer = this.answers.find((answer) => answer.player.userId === this.player.userId)
      return answer || {}
    },

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
    }

  },

  sockets: {

    question_added(){
      this.display.revealQuestion = true
      this.advanceStage()
    },

    answers_adjudicated(data){
      this.delay(1700).then(() => {
        if(data.correct.length > 0 || data.duplicates.length === this.answers){
          // if we have correct answers or all duplicates, just go to the reveal
          let index = this.game.stages.findIndex((stage) => stage.name === 'revealAuthors')
          index = index - this.game.stage
          this.advanceStage(index)
          this.display.revealPicks = false
          this.display.correctAnswer = true
        } else {
          // otherwise, go on
          this.advanceStage()
        }
      })
    },

    authors_revealed(){
      this.advanceStage()
    },

    answers_scored(){
      // tut up
      this.computeScores()
      this.delay(1000).then(() => {
        // first show scores
        this.advanceStage()
        // wait a sec
        // well, not a second, but jsut a figure of speech
        this.delay(1500).then(() => {
          // then go to new round
          this.advanceStage()
        })
      })
    },

    // player_joined(){
    //   if(this.game.stage <= 1){
    //     this.activatePlayers()
    //   }
    // }

  },

  methods: {

    ...mapActions([
      'activatePlayers',
      'incrementRound',
      'incrementStage',
      'nextHotSeat',
      'computeScores',
      'quitGame',
      'endGame'
    ]),

    setDisplay(){
      if(this.player.active || this.player.spectator){
        console.log(this.currentStage)
        // set loading to false every time
        this.display.loading = false
        // hide all display elements
        for (const [key, value] of Object.entries(this.currentStage.display)) {
          this.display[key] = value
        }
      }
    },

    leaving(){
      this.quitGame()
    },

    startRound(){
      if(this.players.length > 1 && this.inHotSeat){
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
      // this.display.endgame = this.players.some((player) => player.score >= this.game.endGameScore)
      return false
    },

    scoreAnswers() {
      this.$socket.client.emit('score_answers', { gameKey: this.gameKey })
    },

    revealAuthors(){
      this.$socket.client.emit('reveal_authors', { gameKey: this.gameKey })
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

    removeExtraPoints(){
      this.answers.forEach((answer) => this.$set(answer, 'extraPoints', false))
    },

    markDuplicate(answer){
      this.removeExtraPoints()
      this.$set(answer, 'duplicate', !(!!answer.duplicate))
    },

    correctChoice(answer){
      this.removeExtraPoints()
      this.$set(answer, 'correct', !(!!answer.correct))
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

    submitAnswer(answerText){
      let answer = {
        player: this.playerInfo,
        answer: answerText
      }
      this.$socket.client.emit('add_answer', { gameKey: this.gameKey, answer: answer })
    },

    submitQuestion(question){

      this.$set(question, 'hotSeatPlayer', this.playerInfo)

      this.$socket.client.emit('add_question', { gameKey: this.gameKey, question: question })

    },

    reorderPlayers(playerOrder){
      this.$socket.client.emit('reorder_players', { gameKey: this.gameKey, playerOrder: playerOrder })
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
    },

    handleOptionClick(action){
      // set point maximum
      switch(action){
        case 'hide-questions':
          this.display.hideQuestion = !this.display.hideQuestion
        break;
        case 'reorder':
          this.popup.reorderPlayers = true
          this.popup.showMenu = false
        break;
        case 'quit':
          this.popup.confirmQuit = true
          this.popup.showMenu = false
        break;
        case 'scoring':
          this.popup.scoring = true
          this.popup.showMenu = false
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

  .gameboard {
    /*min-width: 100vw;*/
    position: relative;
    padding: 0;
    display: flex;
    height: 100%;
    min-height: 100vh;
    flex-direction: column;

    .game {
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
