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
                  @click="openMenu()">
            <span class="icon">
              <i class="fa fa-gear" aria-hidden="true"></i>
            </span>
          </button>
        </div>
      </template>
    </navbar>

    <!-- pop up helper -->
    <popup :display="popup.show" @close="popupClose" :closeable="popup.closeable">
      <!-- options menu -->
      <option-menu :options="game.options"
                   @optionClick="handleOptionClick"
                   v-if="popup.showMenu">
        <template #title>Options</template>
      </option-menu>
      <div class="section" v-else-if="popup.history">
        <article class="panel is-primary">
          <player-list :players="game.quests[game.historyRound].team">
            <h3 class="title is-2 has-text-centered has-text-black">
              &#128081; {{game.quests[game.historyRound].leader.name}}
            </h3>
            <h3 class="subtitle is-4 has-text-centered has-text-black quest-vote-list">
              Quest {{game.historyRound + 1}}
            </h3>
          </player-list>
        </article>
      </div>
      <div class="section" v-else-if="popup.rules">
        <rules />
      </div>
      <div class="section" v-else-if="popup.allegiance">
        <div class="is-centered has-text-centered container"
            @click="display.allegiance = !display.allegiance"
            >
          <p>click to flip</p>
          <br/>
          <!-- Check the allegiance -->
          <allegiance :display="display.allegiance"
                      :allegiance="allegiance"
                      :role="role.name"
                      :minions="minions"
                      />
        </div>
      </div>
      <div v-else-if="display.endgame" class="container has-text-centered">
        <h3 class="title is-1 fancy-title has-text-centered"
            v-if="this.currentQuest.rejected.length === 5 || game.minionWins > game.knightWins">
          Minions Win
        </h3>
        <div v-else>
          <h3 class="title is-1 fancy-title has-text-centered">
            Knights Win
          </h3>
          <br/>
          <h3 class="subtitle is-5 is-black has-text-centered">
            However,
          </h3>
          <h3 class="subtitle is-5 is-black has-text-centered">
            If Minions can guess Merlin, they win...
          </h3>
        </div>
      </div>
      <div class="section" v-else-if="popup.selectTeam">
        <!-- team leader selects players -->
        <team-select :players="players"
                     :playerCount="questPlayerCount"
                     :submitted="game.submittedSelections"
                     @teamMemberSelected="selectPlayer"
                     @selectTeam="selectTeam"
                     />
      </div>
      <div class="section" v-else-if="popup.vote">
        <!-- all players vote on the leader's selections -->
        <div class="player-list-vote">
          <player-list :players="currentQuest.team">
            <h3 class="title is-2 has-text-centered has-text-black is-marginless">
              &#128081; {{leader.name}}
            </h3>
            <h3 class="subtitle is-4 has-text-centered has-text-black quest-vote-list">
              Quest {{game.round + 1}}
            </h3>
          </player-list>
        </div>
        <br/>
        <div class="columns is-variable is-2 is-centered is-mobile" >
          <div class="column is-3-desktop" 
               :class="{ 'has-text-right': !button }"
               v-for="button in [false, true]"
               >
            <button class="button is-large-tablet"
                    :class="{ 'is-disabled': !display.vote, 'is-danger': !button, 'is-success': button }"
                    :disabled="!display.vote"
                    @click="vote(button)">
              <span class="icon">
                <i class="fa fa-close" aria-hidden="true"></i>
              </span>
              <span>{{ button ? 'Approve' : 'Reject' }}</span>
            </button>
          </div>
        </div>
      </div>
      <div class="section" v-else-if="popup.votereveal">
        <vote-reveal :votes="currentQuest.vote" :rejected="currentQuest.reject">
          <div v-if="isLeader">
            <div class="has-text-centered">
               <!-- && (currentQuest.reject === null || currentQuest.reject === null) -->
              <button class="button is-medium"
                      :class="{
                        'is-hidden': !display.picks
                      }"
                      @click="voteTally()">
                Continue
              </button>
            </div>
            <div class="has-text-centered">
              <button class="button is-medium"
                      :class="{
                        'is-invisible': display.revealing
                      }"
                      @click="revealPicks()">
                Reveal Votes
              </button>
            </div>
          </div>
        </vote-reveal>
      </div>
      <div class="section" v-else-if="popup.quest">
        <quest :team="currentQuest.team"
               :quest="game.quest"
               :onQuest="onQuest"
               @saveQuestOutcome="saveQuestOutcome"
               @questDecision="questDecision"
               />
      </div>
      <div class="section" v-else-if="popup.questResults">
        <quest-result :results="currentQuest.results">
          <button class="button is-medium"
                  :style="{ 'is-invisible': display.questResults }"
                  v-show="!display.questEnd"
                  v-if="isLeader"
                  @click="revealQuest()">
            Reveal Quest
          </button>
          <div class="is-hidden">{{display.questResults}}</div>
          <button class="button is-medium"
                   v-show="display.questEnd && !display.questResults"
                  @click="questResults()">
            Continue
          </button>
        </quest-result>
      </div>
    </popup>


    <div class="game">
      <div class="game-display">
        <div class="columns">
          <div class="column" >
            <steps :leader="leader"
                   :isLeader="isLeader"
                   :teams="teamSize"
                   :currentRound="game.round"
                   :quests="game.quests"
                   :doubleFail="doubleFail"
                   @selectTeam="showSelectTeam"
                   @teamHistory="teamHistory"
                   />
            <votes :rejected="currentQuest.rejected"/>
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
import OptionMenu from '@/components/OptionMenu'
import ConfirmBox from '@/components/ConfirmBox'
import Steps from '@/components/Steps'
import Votes from '@/components/Votes'
import PlayerList from '@/components/PlayerList'
// game components
import Allegiance from './game/Allegiance'
import Quest from './game/Quest'
import QuestResult from './game/QuestResult'
import Rules from './game/Rules'
import TeamSelect from './game/TeamSelect'
import VoteReveal from './game/VoteReveal'

import { mapState, mapGetters, mapActions } from 'vuex'

export default {

  name: 'Play',

  components: {
  	Navbar,
    Popup,
    Titlebar,
    OptionMenu,
    ConfirmBox,
    Steps,
    PlayerList,
    Votes,
    Allegiance,
    Quest,
    QuestResult,
    Rules,
    TeamSelect,
    VoteReveal,
  },

  // mounted(){
  //   this.$nextTick(() => {
  //     window.setInterval(() => {
  //         this.checkGameStatus()
  //     },120000)
  //   })
  // },

  created(){
    window.addEventListener('beforeunload', this.leaving)
    document.addEventListener("visibilitychange", this.checkGameStatus)
    document.addEventListener('keyup', (event) => {
        if (event.keyCode === 27) {
            // this.popup.show = false;
            this.popupClose()
        }
    });
    this.popup.show = true
    this.popup.allegiance = true
  },

  // mounted(){
  //   window.addEventListener('beforeunload', this.quitGame)
  // },

  beforeDestroy(){
    window.removeEventListener('beforeunload', this.leaving)
    document.removeEventListener("visibilitychange", this.checkGameStatus)
    document.removeEventListener('keyup', (event) => {
        if (event.keyCode === 27) {
            this.popup.show = false;
        }
    });
    this.quitGame();
  },

  // destroyed(){
  //   window.removeEventListener('beforeunload', this.quitGame)
  // },

  data () {
    return {

      display: {
        endgame: false,
        allegiance: false,
        vote: false,
        picks: false,
        voteResults: false,
        revealing: false,
        quest: false,
        questResults: false,
      },

      popup: {
        show: true,
        showMenu: false,
        allegiance: true,
        selectTeam: false,
        vote: false,
        votereveal: false,
        closeable: true,
        quest: false,
        questResults: false,
        questEnd: false,
        history: false,
        rules: false
      },

      game: {

        sync: 0,

        checkStatus: false,

        round: 0,

        historyRound: 0,

        stage: 0,

        knightWins: 0,

        minionWins: 0,

        quest: null,

        quests: [
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          },
          {
            leader: '',
            team: [],
            rejected: [],
            vote: [],
            results: [],
            success: null,
            reject: null
          }
        ],

        submittedSelections: false,

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
              revealing: false,
              questEnd: false,
              popup: {
                show: false,
                allegiance: false,
                closeable: true
              }
            },
          },
          {
            name: 'vote',
            directions: {
              title: "Vote",
              text: "Approve or Reject the Leader's team"
            },
            display: {
              vote: true,
              popup: {
                selectTeam: false,
                allegiance: false,
                vote: true,
                closeable: false,
                show: true
              }
            },
          },
          {
            name: 'reveal-vote',
            directions: {
              title: "Results",
              text: "Results of the vote"
            },
            display: {
              revealing: false,
              vote: false,
              popup: {
                vote: false,
                votereveal: true
              }
            }
          },
          {
            name: 'quest',
            directions: {
              title: "Quest",
              text: "The team embarks on the quest",
            },
            display: {
              popup: {
                quest: true,
                votereveal: false
              }
            },
          },
          {
            name: 'reveal-quest',
            directions: {
              title: "Quest Reveal",
              text: "Results of the quest",
            },
            display: {
              quest: false,
              questResults: true,
              popup: {
                quest: false,
                questResults: true
              }
            },
          },
          {
            name: 'quest-tally',
            directions: {
              title: "Score",
              text: "Results of the quest",
            },
            display: {
              questEnd: false,
              popup: {
                questResults: false,
                show: false
              }
            },
          },
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

    'currentQuest.vote'(val, oldVal) {
      if(val.length === this.players.length && this.popup.vote){
      // if(val.length === 1 && this.popup.vote){
        // add fake votes for testing
        // val.push({ player: 'gil_123', vote: true})
        // val.push({ player: 'gil_123', vote: true})
        // val.push({ player: 'gil_123', vote: true})
        // val.push({ player: 'gil_123', vote: false})
        // val.push({ player: 'gil_123', vote: false})

        this.advanceStage()
        this.shuffle(this.currentQuest.vote)
      }
    },


    'currentQuest.results'(val) {
      try {
        // if(val.length === 1){
        //   this.advanceStage()
        // }
        if(val.length === this.questPlayerCount){
          this.advanceStage()
        }
      } catch(e){
        console.log(val, this.questPlayerCount)
      }
    },

    isEndGame(val){
      if(val){
        this.popup.show = true
        this.popup.closeable = false
      }
    }

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
    ]),

    questPlayerCount(){
      return this.teamSize[this.game.round]
    },

    doubleFail(){
      return this.players.length > 6
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

    currentQuest(){
      return this.game.quests[this.game.round]
    },

    onQuest(){
      if(this.currentQuest.team.length === this.questPlayerCount){
        let player = this.currentQuest.team.some(player => player.userId === this.player.userId)
        return player
      }
      return false
    },

    isEndGame(){
      let endGame = false
      // if minions won by rejection
      if(this.currentQuest.rejected.length === 5){
        endGame = true
      }
      // if one team won by votes
      if(this.game.knightWins >= 3 || this.game.minionWins >= 3){
        endGame = true
      }
      return endGame
    },
  },

  sockets: {

    team_selected(data){
      this.$set(this.currentQuest, 'leader', JSON.parse(JSON.stringify(this.leader)))
      this.$set(this.currentQuest, 'team', data.team)
      this.advanceStage()
      this.game.sync++
    },

    player_vote(data){
      this.$set(this.currentQuest.vote, this.currentQuest.vote.length, {
        player: data.player,
        vote: data.decision
      })
      this.game.sync++
    },

    picks_revealed(){
      // set up a nice delay in card flips
      for(let i = 0; i < this.currentQuest.vote.length; i++){
        this.delay(200 + (i * 800)).then(() => {
          this.$set(this.currentQuest.vote[i], 'display', true)
        })
      }
      // delay the result
      this.delay(200 + (this.currentQuest.vote.length * 1000)).then(() => {
        // do this for the leader
        this.display.picks = true
        this.tallyVoteResutls()
      })
      this.game.sync++
    },

    team_vote(data){
      if(data.rejected){
        this.currentQuest.rejected.push({
          leader: this.leader,
          team: this.currentQuest.team,
        })
        let reject = JSON.parse(JSON.stringify(this.currentQuest.rejected))
        // reset
        this.startRound()
        // add the rejected
        this.currentQuest.rejected = reject
        // reset stage
        this.advanceStage(1, true)
      } else {
        // move forward with the mission
        this.advanceStage()
      }
      this.game.sync++
    },

    quest_outcome(data){
      this.currentQuest.results.push({
        success: data.quest === 'success',
        reveal: false
      })
      this.game.sync++
    },

    quest_reveal(data){
      // delay the result
      for(let i = 0; i < this.currentQuest.results.length; i++){
        this.delay(200 + (i * 800)).then(() => {
          this.$set(this.currentQuest.results[i], 'reveal', true)
        })
      }
      this.display.questResults = false
      this.display.questEnd = true
      this.game.sync++
    },

  },

  methods: {

    ...mapActions([
      'incrementRound',
      'nextLeader'
    ]),

    checkGameStatus(){
      if(!this.game.checkStatus){
        // say that we're checking the status
        this.game.checkStatus = true
        this.$socket.client.emit('request_game_state', {
          gameKey: this.gameKey,
          sync: this.game.sync
        }, () => {
          setTimeout(() => {
            this.game.checkStatus = false
          }, 3000)
        })
      }
    },

    quitGame(){
      this.$socket.client.emit('quit_game', {
        gameKey: this.gameKey
      })
    },

    selectPlayer(player) {
      this.$store.dispatch('playerSelect', player.userId)
    },

    selectTeam(){
      this.game.submittedSelections = true
      // emit to socket
      this.$socket.client.emit('submit_team', {
        gameKey: this.gameKey,
        team: this.players.filter(player => player.selected)
      })
    },

    showSelectTeam() {
      this.$store.dispatch('clearPlayerSelections')
      this.$set(this.popup, 'show', true)
      this.$set(this.popup, 'selectTeam', true)
      this.$set(this.popup, 'closeable', true)
    },

    vote(decision){
      if(this.display.vote){
        this.$socket.client.emit('vote', {
          gameKey: this.gameKey,
          player: this.player.userId,
          decision: decision
        })
        this.display.vote = false
      }
    },

    voteTally() {
      this.display.picks = false
      // go back and get a new leader
      this.$socket.client.emit('team_result', {
        gameKey: this.gameKey,
        rejected: this.currentQuest.reject
      })
    },

    tallyVoteResutls(){
      let successes = this.currentQuest.vote.filter(vote => vote.vote)
      this.currentQuest.reject = !(successes.length > (this.currentQuest.vote.length - successes.length))
    },

    questDecision(decision){
      if(!this.display.quest){
        this.$set(this.game, 'quest', decision)
      }
    },

    questResults(){
      // number of fails
      let failCount = 0
      this.currentQuest.results.forEach((result) => {
        if(!result.success){
          failCount++
        }
      })
      // check the limit for what counts as a fail
      let failLimit = (this.doubleFail && game.round === 3) ? 2 : 1
      // set success
      this.$set(this.currentQuest, 'success', failCount < failLimit)
      // move on to the next stage
      this.advanceStage()
    },

    revealQuest(){
      this.$socket.client.emit('reveal_quest', {
        gameKey: this.gameKey
      })
    },

    saveQuestOutcome(){
      // emit to socket
      this.$socket.client.emit('submit_quest', {
        gameKey: this.gameKey,
        quest: this.game.quest
      })
      this.display.quest = true
    },

    teamHistory(round){
      this.game.historyRound = round
      this.popup.history = true
      this.popup.closeable = true
      this.popup.show = true
    },

    setDisplay(){
      // hide all display elements
      for (const [key, value] of Object.entries(this.currentStage.display)) {
        if(key === 'popup'){
          for (const [popup_key, popup_value] of Object.entries(this.currentStage.display.popup)) {
            this.popup[popup_key] = popup_value
          }
        } else {
          this.display[key] = value
        }
      }
    },

    revealPicks() {
      this.display.revealing = true
      this.$socket.client.emit('reveal_picks', {
        gameKey: this.gameKey
      })
    },

    titlebarClick(){
      this.display.loading = true
      this[this.currentStage.button.action]()
    },

    startRound(){
      // check the endgame
      if(this.isEndGame){
        this.display.endgame = true 
        this.popup.show = true
        this.popup.closeable = false
      } else {
        // reset the quests
        this.$set(this.game.quests, this.game.round, {
          team: [],
          rejected: [],
          vote: [],
          results: [],
          success: null,
          reject: null
        })
        // restart submittingSelections
        this.game.submittedSelections = false
        // remove the quest
        this.game.quest = null
        // next leader
        this.nextLeader()
      }
    },

    advanceRound(increment = 1){
      if(this.currentQuest.success){
        this.game.knightWins++
      } else {
        this.game.minionWins++
      }

      if(this.game.stage < this.game.quests.length){
        this.game.round += increment
        this.startRound()
      }
    },

    advanceStage(increment = 1, restart = false){
      if(!this.isEndGame){
        let len = this.game.stages.length
        if(this.game.stage === len - 2 || restart){
         this.game.stage = 0
         if(!restart){
           this.advanceRound()
         }
        } else {
          this.game.stage += increment
        }
      }
    },

    popupClose(){
      if(this.popup.closeable){
        for(let pop in this.popup){
          this.popup[pop] = false
        }
        this.display.allegiance = false
      }
    },

    handleOptionClick(action){
      // set point maximum
      switch(action){
        case 'allegiance':
          this.popup.showMenu = false
          this.popup.closeable = true
          this.popup.allegiance = true
        break;
        case 'scoring':
          this.popup.showMenu = false
          this.popup.closeable = true
          this.popup.rules = true
        break;
      }

    },

    openMenu(){
      this.popup.show = true
      this.popup.showMenu = true
      this.popup.closeable = true
    },

    // quitGame(){
    //   this.$socket.client.emit('quit_game', {
    //     gameKey: this.gameKey,
    //     userId: this.player.userId
    //   })
    // },
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

  .token {
    margin-top: 20px;
  }

  .rules {
    .section {
/*      overflow-y: scroll;
      height: 500px;*/
    }
  }

  .player-list-vote {
    .quest-vote-list {
      margin: 10px 0;
    }
  }

  .panel-block {
    background-color: white;
    th {
      white-space: nowrap;
    }
  }

  .image {
    padding: 20px;
    height: 300px;
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
    padding-bottom: 30px;
    display: flex;
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
